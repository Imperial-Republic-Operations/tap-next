export const roles: string[] = ["BANNED", "PLAYER", "STAFF", "GAME_MODERATOR", "ASSISTANT_ADMIN", "ADMIN", "SYSTEM_ADMIN"];

export function userHasAccess(requiredRole: string | null, user: any): boolean {
    if (!requiredRole) return true;
    if (!user || !user.role) return false;
    const requiredLevel = roles.indexOf(requiredRole);
    const userLevel = roles.indexOf(user.role);

    return userLevel >= requiredLevel;
}