import { prisma } from "@/lib/prisma";

export type CustomAccessFunction = (user: any) => boolean | Promise<boolean>;

export const customAccessFunctions: Record<string, CustomAccessFunction> = {
    forceAwareCharacters: async (user) => {
        if (!user) return false;

        const forceAwareCharacters = await prisma.character.count({
            where: {
                userId: user.id,
                forceProfile: {
                    aware: true,
                },
            },
        });

        return forceAwareCharacters > 0;
    },

    hasActiveCharacters: async (user) => {
        if (!user) return false;

        const activeCharacters = await prisma.character.count({
            where: {
                userId: user.id,
                status: 'ACTIVE'
            }
        });

        return activeCharacters > 0;
    },

    hasSenator: async (user) => {
        if (!user) return false;

        // Check if user is a senator OR has senate leadership position
        const [senator, isLeadership] = await Promise.all([
            prisma.senator.findUnique({
                where: {
                    userId: user.id,
                },
            }),
            customAccessFunctions.senateLeadership(user)
        ]);

        return !!senator || isLeadership;
    },

    senateLeadership: async (user) => {
        if (!user) return false;

        // Get senate leadership position IDs
        const senateSettings = await prisma.senateSettings.findFirst({
            select: {
                supremeRulerPositionId: true,
                presidentPositionId: true,
                vicePresidentPositionId: true,
            }
        });

        if (!senateSettings) return false;

        // Check if user has a character in any of these positions
        const memberCount = await prisma.member.count({
            where: {
                character: {
                    userId: user.id
                },
                positionId: {
                    in: [
                        senateSettings.supremeRulerPositionId,
                        senateSettings.presidentPositionId,
                        senateSettings.vicePresidentPositionId,
                    ]
                }
            }
        });

        return memberCount > 0;
    },

    highCouncil: async (user) => {
        if (!user) return false;

        // Get high council position IDs
        const highCouncilSettings = await prisma.highCouncilSettings.findFirst({
            select: {
                chairmanPositionId: true,
                viceChairmanPositionId: true,
                highCouncilorPositionId: true,
                honoraryHighCouncilorPositionId: true,
            },
        });

        if (!highCouncilSettings) return false;

        // Check if user has a character in any of these positions
        const memberCount = await prisma.member.count({
            where: {
                character: {
                    userId: user.id
                },
                positionId: {
                    in: [
                        highCouncilSettings.chairmanPositionId,
                        highCouncilSettings.viceChairmanPositionId,
                        highCouncilSettings.highCouncilorPositionId,
                        highCouncilSettings.honoraryHighCouncilorPositionId,
                    ]
                }
            }
        });

        return memberCount > 0;
    },
};