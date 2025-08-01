'use server'

import { prisma } from "@/lib/prisma";
import { ApprovalStatus, Prisma } from "@/lib/generated/prisma";

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

interface UpdateCharacterData {
    name: string;
    age: number | null;
    speciesId: bigint;
    homeworldId: bigint;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
    avatarLink: string;
    appearance: string;
    habits: string;
    strengths: string;
    weaknesses: string;
    hobbies: string;
    talents: string;
    background: string;
    interactions: string[];
    previousPositions: string[];
    educationHistory: string[];
    honors: string[];
    goals: string[];
}

export async function updateCharacter(charId: bigint, data: UpdateCharacterData) {
    return prisma.$transaction(async (tx) => {
        // Update the main character record
        const character = await tx.character.update({
            where: { id: charId },
            data: {
                name: data.name,
                age: data.age,
                speciesId: data.speciesId,
                homeworldId: data.homeworldId,
                gender: data.gender,
                status: data.status,
                avatarLink: data.avatarLink || null,
                appearance: data.appearance || null,
                habits: data.habits || null,
                strengths: data.strengths || null,
                weaknesses: data.weaknesses || null,
                hobbies: data.hobbies || null,
                talents: data.talents || null,
                background: data.background || null,
            },
        });

        // Delete existing related records
        await Promise.all([
            tx.characterInteraction.deleteMany({ where: { characterId: charId } }),
            tx.characterPreviousPosition.deleteMany({ where: { characterId: charId } }),
            tx.characterEducation.deleteMany({ where: { characterId: charId } }),
            tx.characterHonor.deleteMany({ where: { characterId: charId } }),
            tx.characterGoal.deleteMany({ where: { characterId: charId } }),
        ]);

        // Create new related records (filter out empty strings)
        const validInteractions = data.interactions.filter(i => i.trim() !== '');
        const validPositions = data.previousPositions.filter(p => p.trim() !== '');
        const validEducation = data.educationHistory.filter(e => e.trim() !== '');
        const validHonors = data.honors.filter(h => h.trim() !== '');
        const validGoals = data.goals.filter(g => g.trim() !== '');

        await Promise.all([
            validInteractions.length > 0 ? tx.characterInteraction.createMany({
                data: validInteractions.map(interaction => ({
                    characterId: charId,
                    interaction,
                })),
            }) : Promise.resolve(),
            
            validPositions.length > 0 ? tx.characterPreviousPosition.createMany({
                data: validPositions.map(position => ({
                    characterId: charId,
                    position,
                })),
            }) : Promise.resolve(),
            
            validEducation.length > 0 ? tx.characterEducation.createMany({
                data: validEducation.map(education => ({
                    characterId: charId,
                    education,
                })),
            }) : Promise.resolve(),
            
            validHonors.length > 0 ? tx.characterHonor.createMany({
                data: validHonors.map(honor => ({
                    characterId: charId,
                    honor,
                })),
            }) : Promise.resolve(),
            
            validGoals.length > 0 ? tx.characterGoal.createMany({
                data: validGoals.map(goal => ({
                    characterId: charId,
                    goal,
                })),
            }) : Promise.resolve(),
        ]);

        return character;
    });
}

export async function fetchPendingCharacters(page: number = 0) {
    const limit = 20;
    
    const pending = await prisma.character.findMany({
        where: { approvalStatus: "PENDING" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            species: {
                select: {
                    name: true
                }
            },
            homeworld: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        skip: page * limit,
        take: limit
    });

    const totalCount = await prisma.character.count({
        where: { approvalStatus: "PENDING" }
    });

    return {
        characters: pending,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalCount
    };
}

export async function updateCharacterApprovalStatus(charId: bigint, status: 'APPROVED' | 'DENIED') {
    return prisma.character.update({
        where: { id: charId },
        data: { approvalStatus: status },
        select: {
            id: true,
            name: true,
            approvalStatus: true
        }
    });
}

export async function fetchAllUserCharacters(userId: string) {
    return prisma.character.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: 'asc',
        },
    });
}

export async function claimNPC(characterId: bigint, userId: string) {
    // First check if the character is actually an NPC (userId is null)
    const character = await prisma.character.findUnique({
        where: { id: characterId },
        select: { userId: true, name: true }
    });

    if (!character) {
        throw new Error('Character not found');
    }

    if (character.userId !== null) {
        throw new Error('Character is not an NPC and cannot be claimed');
    }

    // Update the character to assign it to the user
    return prisma.character.update({
        where: { id: characterId },
        data: { userId, approvalStatus: ApprovalStatus.APPROVED },
        select: {
            id: true,
            name: true,
            userId: true
        }
    });
}