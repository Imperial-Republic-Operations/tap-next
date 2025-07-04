'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

let PAGE_SIZE: number = 5;

export type OrganizationDetailsWithChildren = Prisma.OrganizationGetPayload<{
    include: {
        members: {
            include: {
                character: true,
                position: true,
                rank: true,
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
                position: true,
                rank: true,
            },
        },
    },
}>;

export type OrganizationMember = Prisma.MemberGetPayload<{
    include: {
        character: true,
        position: true,
        rank: true,
    },
}>

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
                        position: true,
                        rank: true,
                    },
                },
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

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { factions, totalPages };
}

export async function fetchOrganization(id: bigint): Promise<OrganizationDetailsWithChildren | null> {
    return prisma.organization.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    character: true,
                    position: true,
                    rank: true,
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

export async function fetchOrganizationParents(orgId: bigint): Promise<OrganizationDetails[]> {
    const parents: OrganizationDetails[] = [];

    let currentOrg = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            members: {
                include: {
                    character: true,
                    position: true,
                    rank: true,
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
                        position: true,
                        rank: true,
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

export async function fetchOrganizationMembers(orgId: bigint, page: number) {
    const skip = page * PAGE_SIZE;

    const [members, totalCount] = await Promise.all([
        prisma.member.findMany({
            where: { organizationId: orgId },
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'asc'},
            include: {
                character: true,
                position: true,
                rank: true,
            },
        }),
        prisma.member.count({
            where: { organizationId: orgId },
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { members, totalPages };
}