import { userHasAccess } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export type NavigationAccess = { type: 'open' }
    | { type: 'authenticated' }
    | { type: 'role', role: string }
    | { type: 'team', team: 'character' | 'moderation' | 'force'| 'operations'| 'publication', overrideRole?: string }
    | { type: 'role-and-team', role: string, team: 'character' | 'moderation' | 'force'| 'operations'| 'publication', overrideRole?: string }
    | { type: 'custom', customAccess: (user: any) => boolean | Promise<boolean>, overrideAccess?: NavigationAccess }

export interface NavigationItem {
    title: string;
    path: string;
    exact: boolean;
    access: NavigationAccess;
    badge?: number;
}

export async function userHasNavigationAccess(access: NavigationAccess, user: any) {
    switch (access.type) {
        case 'open':
            return true;
        case 'authenticated':
            return !!user;
        case 'role':
            return userHasAccess(access.role, user);
        case 'team':
            if (user) {
                if (access.overrideRole && userHasAccess(access.overrideRole, user)) {
                    return true;
                }

                return checkTeams(access.team, user);
            }
            return false;
        case 'role-and-team':
            if (user) {
                if (access.overrideRole && userHasAccess(access.overrideRole, user)) {
                    return true;
                }
                
                // First check if user has the required role
                if (!userHasAccess(access.role, user)) {
                    return false;
                }
                
                return checkTeams(access.team, user);
            }
            return false;
        case 'custom':
            // Check override access first if provided
            if (access.overrideAccess) {
                const overrideResult = await userHasNavigationAccess(access.overrideAccess, user);
                if (overrideResult) {
                    return true;
                }
            }
            
            // Execute the custom access function
            return access.customAccess(user);
    }
}

async function checkTeams(team: 'character' | 'moderation' | 'force'| 'operations'| 'publication', user: any) {
    // Get the TeamsSettings and check if user is on the required team
    const teamsSettings = await prisma.teamsSettings.findFirst({
        include: {
            characterTeam: true,
            moderationTeam: true,
            forceTeam: true,
            operationsTeam: true,
            publicationTeam: true,
        }
    });

    if (teamsSettings) {
        const teamIdMap = {
            'character': teamsSettings.characterTeamId,
            'moderation': teamsSettings.moderationTeamId,
            'force': teamsSettings.forceTeamId,
            'operations': teamsSettings.operationsTeamId,
            'publication': teamsSettings.publicationTeamId,
        };

        const requiredTeamId = teamIdMap[team];

        // Check if user is on the required team
        const userWithTeams = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                team: true,
                teams: true,
            }
        });

        if (userWithTeams) {
            // Check if user's primary team matches
            if (userWithTeams.team?.id === requiredTeamId) {
                return true;
            }

            // Check if user is a member of the required team
            return userWithTeams.teams.some(team => team.id === requiredTeamId);
        }
    }

    return false;
}
