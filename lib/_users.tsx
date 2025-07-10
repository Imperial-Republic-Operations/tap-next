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