'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DocumentForView, OrganizationDocumentFullDetails } from "@/lib/types";
import { roles, userHasAccess } from "@/lib/roles";
import Cookies from "js-cookie";
import { getMultiWordCapitalization } from "@/lib/style";
import { DomSanitizer } from "@/components/DomSanitizer";
import { documentsApi, charactersApi, organizationsApi } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useFormatting } from '@/hooks/useFormatting';

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

export default function ViewDocument({params}: PageProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { formatDateTime, t } = useFormatting();
    const [document, setDocument] = useState<DocumentForView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resolvedParams, setResolvedParams] = useState<{type: string; id: string} | null>(null);

    // Resolve params
    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    useEffect(() => {
        if (!resolvedParams) return;

        const { type, id } = resolvedParams;

        // Validate type
        if (type !== 'game' && type !== 'organization' && type !== 'personal') {
            router.push('/documents');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const documentId = BigInt(id);
                if (!documentId) {
                    router.push('/documents');
                    return;
                }

                const response = await documentsApi.getDocument(type as 'game' | 'organization' | 'personal', documentId);
                const documentData = response.data;

                if (!documentData) {
                    router.push('/documents');
                    return;
                }

                setDocument(documentData);
            } catch (err) {
                console.error('Failed to fetch document:', err);
                setError(t.common.error);
                router.push('/documents');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams, router]);

    // Check authorization after session and document are loaded
    useEffect(() => {
        if (status === 'loading' || loading || !document || !resolvedParams) return;

        const checkAccess = async () => {
            try {
                let canAccess = false;
                let isAdmin = false;

                if (session?.user) {
                    isAdmin = userHasAccess(roles[4], session.user);
                }

                if (resolvedParams.type === 'game') {
                    canAccess = true;
                } else if (resolvedParams.type === 'personal') {
                    if (isAdmin) {
                        canAccess = true;
                    } else if (status === 'authenticated') {
                        const activeCharacterId = Cookies.get('activeCharacterId');

                        if (activeCharacterId) {
                            canAccess = document.authorId.toString() === activeCharacterId;
                        }
                    }
                } else if (resolvedParams.type === 'organization') {
                    if (isAdmin) {
                        canAccess = true;
                    } else if (status === 'authenticated') {
                        const activeCharacterId = Cookies.get('activeCharacterId');

                        if (activeCharacterId) {
                            const charId = BigInt(activeCharacterId);

                            try {
                                const [characterResponse, accessResponse] = await Promise.all([
                                    charactersApi.getCharacterClearance(charId),
                                    organizationsApi.getCharacterOrganizationAccess(charId)
                                ]);

                                const character = characterResponse.data;
                                const { accessibleOrgIds, memberships } = accessResponse.data;

                                if (accessibleOrgIds.includes((document as OrganizationDocumentFullDetails).organizationId)) {
                                    canAccess = canCharacterReadDocument(document, character, memberships);
                                }
                            } catch (err) {
                                console.error('Failed to check organization access:', err);
                                canAccess = false;
                            }
                        }
                    }
                }

                if (!canAccess) {
                    router.push('/documents');
                }
            } catch (err) {
                console.error('Failed to check access:', err);
                router.push('/documents');
            }
        };

        checkAccess();
    }, [session, status, document, loading, resolvedParams, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-center">
                    <p>{error}</p>
                    <button 
                        onClick={() => router.push('/documents')}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                        {t.common.back}
                    </button>
                </div>
            </div>
        );
    }

    if (!document || !resolvedParams) {
        return null;
    }

    const { type } = resolvedParams;

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-8xl">
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
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.author}</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {getAuthorName(document, type)}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.status}</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {getMultiWordCapitalization(document.status)}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.documentType}</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {type === 'organization' ? `${(document as OrganizationDocumentFullDetails).type.name} ${t.documents.document}` : `${getMultiWordCapitalization(type)} ${t.documents.document}`}
                                </dd>
                            </div>

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.creationDate}</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    {formatDateTime(document.createdAt)}
                                </dd>
                            </div>

                            {type === 'organization' && (document as OrganizationDocumentFullDetails).organization && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                    <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.organization}</dt>
                                    <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                        {(document as OrganizationDocumentFullDetails).organization.name}
                                    </dd>
                                </div>
                            )}

                            {type === 'organization' && (() => {
                                const assignees = (document as OrganizationDocumentFullDetails).assignees;
                                return assignees && assignees.length > 0;
                            }) && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                    <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.assignees}</dt>
                                    <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                        {(document as OrganizationDocumentFullDetails).assignees?.map((assignee: any) => assignee.name).join(', ')}
                                    </dd>
                                </div>
                            )}

                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.content}</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                    <DomSanitizer content={document.content} />
                                </dd>
                            </div>

                            {type === 'organization' && (() => {
                                const signers = (document as OrganizationDocumentFullDetails).signers;
                                return signers && signers.length > 0;
                            }) && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-4 py-6 sm:col-span-2 sm:px-0">
                                    <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">{t.documents.signedBy}</dt>
                                    <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:mt-2">
                                        {(document as OrganizationDocumentFullDetails).signers?.map((signer: any) => signer.name).join(', ')}
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