'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

let PAGE_SIZE: number = 10;

export type CharacterProfile = Prisma.CharacterGetPayload<{
    include: {
        interactions: true,
        previousPositions: true,
        educationHistory: true,
        honors: true,
        goals: true,
        memberships: {
            include: {
                organization: true,
                position: true,
                rank: true,
            }
        },
    },
}>;

export type CharacterDetails = Prisma.CharacterGetPayload<{
    include: {
        species: true,
        homeworld: true,
        clearance: true,
        interactions: true,
        previousPositions: true,
        educationHistory: true,
        honors: true,
        goals: true,
        awards: true,
        peerage: {
            include: {
                domain: true,
            }
        },
        forceProfile: {
            include: {
                master: true,
                order: {
                    include: {
                        titles: true,
                    }
                },
            }
        },
        memberships: {
            include: {
                organization: true,
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

export type CharacterMembership = Prisma.MemberGetPayload<{
    include: {
        organization: true,
        position: true,
        rank: true,
    },
}>;

export type CharacterForceProfile = Prisma.ForceProfileGetPayload<{
    include: {
        master: true,
        order: {
            include: {
                titles: true,
            }
        },
    },
}>;

export async function fetchCharacters(userId: string, tab: 'personal' | 'npc', page: number) {
    PAGE_SIZE = 4;
    const skip = page * PAGE_SIZE;

    const [characters, totalCount] = await Promise.all([
        prisma.character.findMany({
            where: { userId: tab === 'npc' ? null : userId },
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'asc'},
            include: {
                interactions: true,
                previousPositions: true,
                educationHistory: true,
                honors: true,
                goals: true,
                memberships: {
                    include: {
                        organization: true,
                        rank: true,
                        position: {
                            include: {
                                permissions: true,
                            }
                        },
                    }
                },
            },
        }),
        prisma.character.count({
            where: { userId: tab === 'npc' ? null : userId },
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { characters, totalPages };
}

export async function fetchCharacter(charId: bigint) {
    return prisma.character.findUnique({
        where: { id: charId },
        include: {
            species: true,
            homeworld: true,
            clearance: true,
            interactions: true,
            previousPositions: true,
            educationHistory: true,
            honors: true,
            goals: true,
            awards: true,
            peerage: {
                include: {
                    domain: true,
                }
            },
            forceProfile: {
                include: {
                    master: true,
                    order: {
                        include: {
                            titles: true,
                        }
                    },
                }
            },
            memberships: {
                include: {
                    organization: true,
                    rank: true,
                    position: {
                        include: {
                            permissions: true,
                        },
                    },
                },
            },
        },
    })
}

export async function fetchCharacterClearance(charId: bigint) {
    return prisma.character.findUnique({
        where: { id: charId },
        select: {
            clearanceId: true,
            clearance: { select: { tier: true } },
        },
    })
}