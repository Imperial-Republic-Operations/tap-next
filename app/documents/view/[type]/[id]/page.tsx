import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DocumentForView, fetchDocument, OrganizationDocumentFullDetails } from "@/lib/_documents";
import { roles, userHasAccess } from "@/lib/roles";
import { cookies } from "next/headers";
import { fetchCharacterClearance } from "@/lib/_characters";
import { getCharacterOrganizationAccess } from "@/lib/_organizations";
import { getMultiWordCapitalization } from "@/lib/style";
import { DomSanitizer } from "@/components/DomSanitizer";

interface PageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
}

function hasLeadershipPermissions(memberships: any[], orgId: bigint): boolean {
    const membership = memberships.find(m => m.organizationId === orgId);
    if (!membership?.position?.permissions) return false;

    return membership.position.permissions.some((perm: any) => ['LEADER','SECOND_IN_COMMAND', 'LEADERSHIP'].includes(perm.value));
}

function canCharacterReadDocument(document: any, character: any, memberships: any[]): boolean {
    const hasLeadership = hasLeadershipPermissions(memberships, document.organizationId);

    switch (document.viewType) {
        case 'DEFAULT':
            return true;
        case 'SECURITY_CLEARANCE':
            if (!document.viewClearanceId) return true;
            if (!character?.clearanceId) return false;
            return hasLeadership || character.clearance.tier >= document.viewClearance.tier;
        case 'ASSIGNEES_ONLY':
            const isAssigned = document.assignees?.some((assignee: any) => assignee.id === character.id);
            return hasLeadership || isAssigned;
        default:
            return false;
    }
}

export default async function ViewDocument({params}: PageProps) {
    const resolvedParams = await params;
    const { type, id } = resolvedParams;

    const documentId = BigInt(id);
    if (!documentId) redirect('/documents');

    if (type !== 'game' && type !== 'organization' && type !== 'personal') redirect('/documents');

    const { session, status } = await getSession();
    const document: DocumentForView | null = await fetchDocument(type, documentId);

    if (!document) redirect('/documents');

    let canAccess = false;
    let isAdmin = false;

    if (session?.user) {
        isAdmin = userHasAccess(roles[4], session.user);
    }

    if (type === 'game') {
        canAccess = true;
    } else if (type === 'personal') {
        if (isAdmin) {
            canAccess = true;
        } else if (status === 'authenticated') {
            const cookieStore = await cookies();
            const activeCharacterId = cookieStore.get('activeCharacterId')?.value;

            if (activeCharacterId) {
                canAccess = document.authorId.toString() === activeCharacterId;
            }
        }
    } else if (type === 'organization') {
        if (isAdmin) {
            canAccess = true;
        } else if (status === 'authenticated') {
            const cookieStore = await cookies();
            const activeCharacterId = cookieStore.get('activeCharacterId')?.value;

            if (activeCharacterId) {
                const charId = BigInt(activeCharacterId)

                const character = await fetchCharacterClearance(charId);

                const { accessibleOrgIds, memberships } = await getCharacterOrganizationAccess(charId);

                if (accessibleOrgIds.includes((document as OrganizationDocumentFullDetails).organizationId)) {
                    canAccess = canCharacterReadDocument(document, character, memberships);
                }
            }
        }
    }

    if (!canAccess) redirect('/documents');

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-8xl">
                {/* Loading state would be handled by Suspense boundary in layout */}
                <div>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">
                            {document.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">
                            {getCodifiedId(document, type)}
                        </p>
                    </div>

                    <div className="mt-6">
                        <dl className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Author</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {getAuthorName(document, type)}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Status</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {getMultiWordCapitalization(document.status)}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Document Type</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {type === 'organization' ? `${(document as OrganizationDocumentFullDetails).type.name} Document` : `${getMultiWordCapitalization(type)} Document`}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Creation Date</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {new Date(document.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    })}
                                </dd>
                            </div>

                            {type === 'organization' && (document as OrganizationDocumentFullDetails).organization && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                    <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Organization</dt>
                                    <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                        {(document as OrganizationDocumentFullDetails).organization.name}
                                    </dd>
                                </div>
                            )}

                            {type === 'organization' && (document as OrganizationDocumentFullDetails).assignees && (document as OrganizationDocumentFullDetails).assignees.length > 0 && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                    <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Assignees</dt>
                                    <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                        {(document as OrganizationDocumentFullDetails).assignees.map((assignee: any) => assignee.name).join(', ')}
                                    </dd>
                                </div>
                            )}

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Content</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    <DomSanitizer content={document.content} />
                                </dd>
                            </div>

                            {type === 'organization' && (document as OrganizationDocumentFullDetails).signers && (document as OrganizationDocumentFullDetails).signers.length > 0 && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                    <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Signed By</dt>
                                    <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                        {(document as OrganizationDocumentFullDetails).signers.map((signer: any) => signer.name).join(', ')}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getCodifiedId(document: any, type: string): string {
    if (type === 'game') {
        return `${document.team.abbreviation}-${document.sequenceNumber}`;
    } else if (type === 'organization') {
        if (document.type.useOrganization) {
            return `${document.type.abbreviation}-${document.organization.abbreviation}-${document.sequenceNumber}`;
        } else {
            return `${document.type.abbreviation}-${document.sequenceNumber}`;
        }
    } else {
        // personal document
        const initials = document.author.name.split(' ').map((n: string) => n[0]).join('');
        return `JRNL-${initials}-${document.sequenceNumber}`;
    }
}

function getAuthorName(document: any, type: string): string {
    if (type === 'game') {
        return document.author.username;
    }
    return document.author.name;
}