'use server'

import { prisma } from "@/lib/prisma";
import { Prisma, ViewType } from "@/lib/generated/prisma";
import { fetchCharacterClearance } from "@/lib/_characters";
import { getCharacterOrganizationAccess, getSubOrganizations } from "@/lib/_organizations";

let PAGE_SIZE: number = 10;

export type DocumentForList = GameDocumentWithTeamAndAuthor | OrganizationDocumentWithOrganizationTypeAndAuthor | PersonalDocumentWithAuthor;

export type DocumentForView = GameDocumentWithTeamAndAuthor | OrganizationDocumentFullDetails | PersonalDocumentWithAuthor;

export type GameDocumentWithTeamAndAuthor = Prisma.GameDocumentGetPayload<{
    include: {
        team: true,
        author: true,
    },
}>;

export type OrganizationDocumentWithOrganizationTypeAndAuthor = Prisma.OrganizationDocumentGetPayload<{
    include: {
        organization: true,
        type: true,
        author: true,
    },
}>;

export type OrganizationDocumentFullDetails = Prisma.OrganizationDocumentGetPayload<{
    include: {
        author: true,
        organization: true,
        type: true,
        listClearance: true,
        viewClearance: true,
        signers: true,
        assignees: true,
    },
}>;

export type PersonalDocumentWithAuthor = Prisma.PersonalDocumentGetPayload<{
    include: {
        author: true,
    },
}>;

function hasLeadershipPermissions(memberships: any[], orgId: bigint): boolean {
    const membership = memberships.find(m => m.organizationId === orgId);
    if (!membership?.position?.permissions) return false;

    return membership.position.permissions.some((perm: any) =>
        ['LEADER', 'SECOND_IN_COMMAND', 'LEADERSHIP'].includes(perm.value)
    );
}

function canCharacterReadDocument(
    document: any,
    character: any,
    memberships: any[],
    charId: bigint
): boolean {
    const hasLeadership = hasLeadershipPermissions(memberships, document.organizationId);
    switch (document.viewType) {
        case 'DEFAULT':
            return true; // If they can see it, they can read it
        case 'SECURITY_CLEARANCE':
            // Check if character has view clearance
            if (!document.viewClearanceId) return true; // No clearance required
            if (!character?.clearance?.tier) return false; // Character has no clearance
            return hasLeadership || character.clearance.tier >= document.viewClearance.tier;
        case 'ASSIGNEES_ONLY':
            // Check if assigned or has leadership
            const isAssigned = document.assignees?.some((assignee: any) => assignee.id === charId);
            return isAssigned || hasLeadership;
        default:
            return false;
    }
}

export async function fetchGameDocuments(page: number) {
    const skip = page * PAGE_SIZE;

    const [documents, totalCount] = await Promise.all([
        prisma.gameDocument.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'desc'},
            include: {
                author: true,
                team: true,
            },
        }),
        prisma.gameDocument.count(),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { documents, totalPages };
}

export async function fetchOrganizationDocuments(charId: bigint, orgId: bigint | null, page: number) {
    const skip = page * PAGE_SIZE;

    // Get character's security clearance
    const character = await fetchCharacterClearance(charId);

    // Get character's organization access
    const { accessibleOrgIds, memberships } = await getCharacterOrganizationAccess(charId);

    // If orgId is specified, filter to that org and its suborgs only
    let targetOrgIds = accessibleOrgIds;
    if (orgId) {
        const orgSubOrgs = await getSubOrganizations(orgId);
        targetOrgIds = [orgId, ...orgSubOrgs].filter(id => accessibleOrgIds.includes(id));
    }

    // Build the where clause for document visibility
    const whereClause = {
        AND: [
            // Document must be in an organization the character has access to
            { organizationId: { in: targetOrgIds } },
            {
                OR: [
                    // DEFAULT: Character is in the org or suborg (already filtered above)
                    { viewType: ViewType.DEFAULT },

                    // SECURITY_CLEARANCE: Character has minimum clearance to see it exists
                    {
                        AND: [
                            { viewType: ViewType.SECURITY_CLEARANCE },
                            {
                                OR: [
                                    // No list clearance required (everyone can see it exists)
                                    { listClearanceId: null },
                                    // Character has sufficient clearance
                                    character?.clearance?.tier ? {
                                        listClearance: {
                                            tier: { lte: character.clearance.tier }
                                        }
                                    } : { listClearanceId: null }
                                ]
                            }
                        ]
                    },

                    // ASSIGNEES_ONLY: Character is assigned OR has leadership in the org
                    {
                        AND: [
                            { viewType: ViewType.ASSIGNEES_ONLY },
                            {
                                OR: [
                                    // Character is assigned to the document
                                    { assignees: { some: { id: charId } } },
                                    // Character has leadership permissions in the document's org
                                    ...targetOrgIds
                                        .filter(id => hasLeadershipPermissions(memberships, id))
                                        .map(id => ({ organizationId: id }))
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    const [documents, totalCount] = await Promise.all([
        prisma.organizationDocument.findMany({
            where: whereClause,
            skip,
            take: PAGE_SIZE,
            orderBy: { id: 'desc' },
            include: {
                author: true,
                organization: true,
                type: true,
                listClearance: true,
                viewClearance: true,
            },
        }),
        prisma.organizationDocument.count({
            where: whereClause,
        }),
    ]);

    // Add accessibility metadata to each document
    const documentsWithAccess = documents.map(doc => ({
        ...doc,
        canRead: canCharacterReadDocument(doc, character, memberships, charId)
    }));

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { documents: documentsWithAccess, totalPages };
}

export async function fetchPersonalDocuments(charId: bigint, page: number) {
    const skip = page * PAGE_SIZE;

    const [documents, totalCount] = await Promise.all([
        prisma.personalDocument.findMany({
            where: { authorId: charId },
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'desc'},
            include: {
                author: true,
            },
        }),
        prisma.personalDocument.count({
            where: { authorId: charId },
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { documents, totalPages };
}

export async function fetchDocument(type: 'game' | 'organization' | 'personal', id: bigint) {
    switch (type) {
        case 'game':
            return prisma.gameDocument.findUnique({
                where: { id },
                include: {
                    author: true,
                    team: true,
                },
            });
        case 'organization':
            return prisma.organizationDocument.findUnique({
                where: { id },
                include: {
                    author: true,
                    organization: true,
                    type: true,
                    listClearance: true,
                    viewClearance: true,
                    signers: true,
                    assignees: true,
                },
            });
        case 'personal':
            return prisma.personalDocument.findUnique({
                where: { id },
                include: {
                    author: true,
                },
            });
    }
}