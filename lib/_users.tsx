'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

export type UserWithTeamAndTeams = Prisma.UserGetPayload<{
    include: {
        team: true,
        teams: true,
    },
}>;

export async function fetchUser(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        include: {
            team: true,
            teams: true,
        }
    });
}

export async function fetchUserProfile(userId: string) {
    const [user, characterCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            include: {
                settings: true,
                team: true,
                teams: true,
                characters: {
                    select: {
                        id: true,
                        name: true,
                        approvalStatus: true,
                        status: true,
                    }
                }
            }
        }),
        prisma.character.count({
            where: { userId }
        })
    ]);

    return {
        ...user,
        characterCount,
        activeCharacterCount: user?.characters.filter(c => c.status === 'ACTIVE').length || 0,
        pendingCharacterCount: user?.characters.filter(c => c.approvalStatus === 'PENDING').length || 0,
    };
}

export async function fetchUserSettings(userId: string) {
    return prisma.userSettings.findUnique({
        where: { userId },
        include: {
            defaultCharacter: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
}

export async function updateUserSettings(
    userId: string, 
    settings: {
        language?: string;
        dateFormat?: 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD';
        timeFormat?: 'TWELVE' | 'TWENTY_FOUR';
        emailNotifications?: boolean;
        defaultCharacterId?: bigint | null;
    }
) {
    return prisma.userSettings.upsert({
        where: { userId },
        create: {
            userId,
            ...settings,
        },
        update: settings,
        include: {
            defaultCharacter: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
}

export async function fetchAllUsers(page: number = 0, search: string = '', roleFilter: string = '') {
    const limit = 20;
    const offset = page * limit;
    
    const where = {
        AND: [
            search ? {
                OR: [
                    { name: { contains: search } },
                    { username: { contains: search } },
                    { email: { contains: search } }
                ]
            } : {},
            roleFilter ? { role: roleFilter } : {}
        ]
    };

    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                role: true,
                image: true,
                nexusId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        characters: true
                    }
                }
            },
            orderBy: [
                { role: 'desc' },
                { createdAt: 'desc' }
            ],
            skip: offset,
            take: limit
        }),
        prisma.user.count({ where })
    ]);

    return {
        users,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
    };
}

export async function updateUserRole(userId: string, role: string) {
    return prisma.user.update({
        where: { id: userId },
        data: { role: role as any },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true,
            image: true,
            nexusId: true,
            updatedAt: true
        }
    });
}