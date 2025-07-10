'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

let PAGE_SIZE: number = 5;

export type OrganizationDetailsWithChildren = Prisma.OrganizationGetPayload<{
    include: {
        members: {
            include: {
                character: true,
                rank: true,
                position: {
                    include: {
                        permissions: true,
                    },
                },
            },
        },
        parent: true,
        children: {
            include: {
                members: true,
            }
        },
    },
}>;

export type OrganizationDetails = Prisma.OrganizationGetPayload<{
    include: {
        members: {
            include: {
                character: true,
                rank: true,
                position: {
                    include: {
                        permissions: true,
                    },
                },
            },
        },
    },
}>;

export type OrganizationMember = Prisma.MemberGetPayload<{
    include: {
        character: true,
        position: {
            include: {
                permissions: true,
            },
        },
        rank: true,
    },
}>;

export type OrganizationWithTotalMembers = OrganizationDetailsWithChildren & {
    totalUniqueMembers: number;
};

async function fetchAllOrganizationIdsInHierarchy(orgId: bigint): Promise<bigint[]> {
    const orgIds = [orgId];

    const children = await prisma.organization.findMany({
        where: { parentId: orgId },
        select: { id: true },
    });

    for (const child of children) {
        const childOrgIds = await fetchAllOrganizationIdsInHierarchy(child.id);
        orgIds.push(...childOrgIds);
    }

    return orgIds;
}

export async function fetchUniqueCharacterCount(orgId: bigint): Promise<number> {
    const allOrgIds = await fetchAllOrganizationIdsInHierarchy(orgId);

    const uniqueCharacters = await prisma.member.groupBy({
        by: ['characterId'],
        where: {
            organizationId: {
                in: allOrgIds,
            },
        },
    });

    return uniqueCharacters.length;
}

export async function fetchOrganizationMemberBreakdown(orgId: bigint) {
    const allOrgIds = await fetchAllOrganizationIdsInHierarchy(orgId);

    const allMemberships = await prisma.member.findMany({
        where: {
            organizationId: {
                in: allOrgIds,
            },
        },
        include: {
            character: true,
            organization: {
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                },
            },
            position: true,
            rank: true,
        },
    });

    const characterMemberships = new Map<bigint, typeof allMemberships>();

    allMemberships.forEach(membership => {
        const charId = membership.characterId;
        if (!characterMemberships.has(charId)) {
            characterMemberships.set(charId, []);
        }
        characterMemberships.get(charId)!.push(membership);
    });

    return {
        totalUniqueCharacters: characterMemberships.size,
        totalMemberships: allMemberships.length,
        characterMemberships: Array.from(characterMemberships.entries()).map(([charId, memberships]) => ({
            characterId: charId,
            character: memberships[0].character,
            memberships: memberships,
        })),
        organizationIds: allOrgIds,
    }
}

export async function fetchFactions(page: number) {
    const skip = page * PAGE_SIZE;

    const [factions, totalCount] = await Promise.all([
        prisma.organization.findMany({
            where: { type: 'FACTION' },
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'asc'},
            include: {
                members: {
                    include: {
                        character: true,
                        rank: true,
                        position: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
                parent: true,
                children: {
                    include: {
                        members: true,
                    }
                },
            },
        }),
        prisma.organization.count({
            where: { type: 'FACTION' },
        }),
    ]);

    const factionsWithTotalMembers: OrganizationWithTotalMembers[] = await Promise.all(
        factions.map(async (faction) => {
            const totalUniqueMembers = await fetchUniqueCharacterCount(faction.id);
            return { ...faction, totalUniqueMembers };
        })
    );

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { factions: factionsWithTotalMembers, totalPages };
}

export async function fetchOrganization(id: bigint): Promise<OrganizationDetailsWithChildren | null> {
    return prisma.organization.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    character: true,
                    rank: true,
                    position: {
                        include: {
                            permissions: true,
                        },
                    },
                },
            },
            parent: true,
            children: {
                include: {
                    members: true,
                }
            }, // Fetch immediate children
        },
    });
}

export async function fetchOrganizationWithTotalMembers(id: bigint): Promise<OrganizationWithTotalMembers | null> {
    const organization = await fetchOrganization(id);
    if (!organization) return null;

    const totalUniqueMembers = await fetchUniqueCharacterCount(id);

    return { ...organization, totalUniqueMembers };
}

export async function fetchOrganizationParents(orgId: bigint): Promise<OrganizationDetails[]> {
    const parents: OrganizationDetails[] = [];

    let currentOrg = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            members: {
                include: {
                    character: true,
                    rank: true,
                    position: {
                        include: {
                            permissions: true,
                        },
                    },
                },
            },
        },
    });

    while (currentOrg?.parentId) {
        const parent = await prisma.organization.findUnique({
            where: { id: currentOrg.parentId },
            include: {
                members: {
                    include: {
                        character: true,
                        rank: true,
                        position: {
                            include: {
                                permissions: true,
                            },
                        },
                    },
                },
            },
        });

        if (!parent) break;

        parents.push(parent);
        currentOrg = parent;
    }

    return parents;
}

export async function fetchOrganizationMembers(
    orgId: bigint,
    page: number,
    filters?: {
        search?: string;
        filterType?: 'all' | 'leadership' | 'high command' | 'officers' | 'enlisted' | 'civilian';
        sortBy?: 'name' | 'rank' | 'position' | 'joined';
    },
) {
    const skip = page * PAGE_SIZE;

    const where: any = { organizationId: orgId };

    if (filters?.search) {
        where.OR = [
            {
                character: {
                    name: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            },
            {
                rank: {
                    name: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            },
            {
                position: {
                    name: {
                        contains: filters.search,
                        mode: 'insensitive',
                    },
                },
            },
        ];
    }

    if (filters?.filterType && filters.filterType !== 'all') {
        switch (filters.filterType) {
            case 'leadership':
                where.position = {
                    permissions: {
                        some: {
                            value: {
                                in: ['LEADER', 'SECOND_IN_COMMAND', 'LEADERSHIP'],
                            },
                        },
                    },
                };
                break;
            case 'high command':
                where.rank = {
                    tier: 'HIGH_COMMAND',
                };
                break;
            case 'officers':
                where.rank = {
                    tier: {
                        in: ['OFFICER', 'COMMAND'],
                    },
                };
                break;
            case 'enlisted':
                where.rank = {
                    tier: 'ENLISTED',
                };
                break;
            case 'civilian':
                where.rank = null;
                break;
        }
    }

    let orderBy: any = { id: 'asc' };
    if (filters?.sortBy) {
        switch (filters.sortBy) {
            case 'name':
                orderBy = { character: { name: 'asc' } };
                break;
            case 'rank':
                orderBy = [
                    { rank: { level: 'desc' } },
                    { character: { name: 'asc' } },
                ];
                break;
            case 'position':
                orderBy = [
                    { position: { name: 'asc' } },
                    { character: { name: 'asc' } }
                ];
                break;
            case 'joined':
                orderBy = { createdAt: 'desc' };
                break;
        }
    }

    let members: any[];

    if (filters?.sortBy === 'rank') {
        const allMembers = await prisma.member.findMany({
            where,
            include: {
                character: true,
                position: {
                    include: {
                        permissions: true,
                    },
                },
                rank: true,
            },
        });

        const tierOrder = {
            'ROYAL_THRONE': 1,
            'HIGH_COMMAND': 2,
            'COMMAND': 3,
            'OFFICER': 4,
            'ENLISTED': 5,
        };

        const sortedMembers = allMembers.sort((a, b) => {
            if (!a.rank && !b.rank) return a.character.name.localeCompare(b.character.name);
            if (!a.rank) return 1;
            if (!b.rank) return -1;

            const aTierOrder = tierOrder[a.rank.tier as keyof typeof tierOrder] || 999;
            const bTierOrder = tierOrder[b.rank.tier as keyof typeof tierOrder] || 999;

            if (aTierOrder !== bTierOrder) return aTierOrder - bTierOrder;

            if (a.rank.level !== b.rank.level) {
                return b.rank.level - a.rank.level;
            }

            return a.character.name.localeCompare(b.character.name);
        });

        members = sortedMembers.slice(skip, skip + PAGE_SIZE);
    } else if (filters?.sortBy === 'position') {
        const allMembers = await prisma.member.findMany({
            where,
            include: {
                character: true,
                position: {
                    include: {
                        permissions: true,
                    },
                },
                rank: true,
            },
        });

        const getPositionOrder = (member: any) => {
            if (!member.position) return 6;

            const permissions = member.position.permissions.map((p: any) => p.value) || [];

            if (permissions.includes('LEADER')) return 1;
            if (permissions.includes('SECOND_IN_COMMAND')) return 2;
            if (permissions.includes('LEADERSHIP')) return 3;
            if (permissions.length > 0) return 4;

            return 5;
        };

        const sortedMembers = allMembers.sort((a, b) => {
            const aOrder = getPositionOrder(a);
            const bOrder = getPositionOrder(b);

            if (aOrder !== bOrder) return aOrder - bOrder;

            return a.character.name.localeCompare(b.character.name);
        });

        members = sortedMembers.slice(skip, skip + PAGE_SIZE);
    } else {
        members = await prisma.member.findMany({
            where,
            skip,
            take: PAGE_SIZE,
            orderBy,
            include: {
                character: true,
                position: {
                    include: {
                        permissions: true,
                    },
                },
                rank: true,
            },
        });
    }

    const [, totalCount] = await Promise.all([
        Promise.resolve(),
        prisma.member.count({
            where,
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { members, totalPages };
}

export async function getCharacterOrganizationAccess(charId: bigint) {
    // Get character's direct memberships
    const memberships = await prisma.member.findMany({
        where: { characterId: charId },
        include: {
            organization: true,
            rank: true,
            position: {
                include: {
                    permissions: true
                }
            }
        }
    });

    // Get all organization IDs the character has access to (including suborgs)
    const accessibleOrgIds = new Set<bigint>();

    for (const membership of memberships) {
        // Add the direct organization
        accessibleOrgIds.add(membership.organizationId);

        // Add all sub-organizations recursively
        const subOrgs = await getSubOrganizations(membership.organizationId);
        subOrgs.forEach(orgId => accessibleOrgIds.add(orgId));
    }

    return {
        accessibleOrgIds: Array.from(accessibleOrgIds),
        memberships
    };
}

export async function getSubOrganizations(parentOrgId: bigint): Promise<bigint[]> {
    const children = await prisma.organization.findMany({
        where: { parentId: parentOrgId },
        select: { id: true }
    });

    const allSubOrgs: bigint[] = [];

    for (const child of children) {
        allSubOrgs.push(child.id);
        // Recursively get sub-organizations
        const grandChildren = await getSubOrganizations(child.id);
        allSubOrgs.push(...grandChildren);
    }

    return allSubOrgs;
}