import { prisma } from "@/lib/prisma";
import { userHasAccess } from "@/lib/roles";
import { customAccessFunctions } from "./customAccessFunctions";
import { breadcrumbResolvers } from "./breadcrumbResolvers";
import { badgeResolvers } from "./badgeResolvers";
import { NavigationItem, NavigationLocation, NavigationAccessType, TeamType } from "@/lib/generated/prisma";

// Type for navigation items without sensitive access functions
export type SerializableNavigationItem = Omit<NavigationItem, 'customAccessFunction' | 'accessRole' | 'accessTeam' | 'accessOverrideRole'> & {
  badge?: number;
};

export async function userHasNavigationAccess(navigationItem: NavigationItem, user: any): Promise<boolean> {
  // Handle banned users first
  if (user && user.role === 'BANNED') {
    return false;
  }

  switch (navigationItem.accessType) {
    case NavigationAccessType.OPEN:
      return true;
      
    case NavigationAccessType.AUTHENTICATED:
      return !!user && user.role !== 'BANNED';
      
    case NavigationAccessType.ROLE:
      return navigationItem.accessRole ? userHasAccess(navigationItem.accessRole, user) : false;
      
    case NavigationAccessType.TEAM:
      if (user) {
        if (navigationItem.accessOverrideRole && userHasAccess(navigationItem.accessOverrideRole, user)) {
          return true;
        }
        return navigationItem.accessTeam ? checkTeams(navigationItem.accessTeam, user) : false;
      }
      return false;
      
    case NavigationAccessType.ROLE_AND_TEAM:
      if (user) {
        if (navigationItem.accessOverrideRole && userHasAccess(navigationItem.accessOverrideRole, user)) {
          return true;
        }
        
        if (!navigationItem.accessRole || !userHasAccess(navigationItem.accessRole, user)) {
          return false;
        }
        
        return navigationItem.accessTeam ? checkTeams(navigationItem.accessTeam, user) : false;
      }
      return false;
      
    case NavigationAccessType.CUSTOM:
      // 1. Check if customAccessFunction is provided
      if (!navigationItem.customAccessFunction) {
        return false;
      }
      
      // 2. Check if provided function exists
      const customFunction = customAccessFunctions[navigationItem.customAccessFunction];
      if (!customFunction) {
        console.error(`Custom access function '${navigationItem.customAccessFunction}' not found`);
        return false;
      }
      
      // 3. Check if accessOverrideRole is provided
      if (navigationItem.accessOverrideRole && userHasAccess(navigationItem.accessOverrideRole, user)) {
        return true;
      }
      
      // 4. Check if either accessRole or accessTeam is provided
      if (navigationItem.accessRole || navigationItem.accessTeam) {
        let hasRequiredAccess = true;
        
        // Check role requirement
        if (navigationItem.accessRole && !userHasAccess(navigationItem.accessRole, user)) {
          hasRequiredAccess = false;
        }
        
        // Check team requirement
        if (navigationItem.accessTeam && !(await checkTeams(navigationItem.accessTeam, user))) {
          hasRequiredAccess = false;
        }
        
        if (!hasRequiredAccess) {
          return false;
        }
      }
      
      // 5. Run the provided function
      return await customFunction(user);
      
    default:
      return false;
  }
}

async function checkTeams(team: TeamType, user: any): Promise<boolean> {
  if (!user) return false;

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
      'CHARACTER': teamsSettings.characterTeamId,
      'MODERATION': teamsSettings.moderationTeamId,
      'FORCE': teamsSettings.forceTeamId,
      'OPERATIONS': teamsSettings.operationsTeamId,
      'PUBLICATION': teamsSettings.publicationTeamId,
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

export async function getNavigationItems(
  location: NavigationLocation, 
  user: any,
  context?: string
): Promise<SerializableNavigationItem[]> {
  // Get navigation items from database
  const navigationItems = await prisma.navigationItem.findMany({
    where: {
      active: true,
      location: location,
      ...(context && { parentId: BigInt(context) })
    },
    orderBy: { orderIndex: 'asc' }
  });

  // Filter items based on access and environment
  const visibleItems: SerializableNavigationItem[] = [];
  
  for (const item of navigationItems) {
    const hasAccess = await userHasNavigationAccess(item, user);
    const showInEnv = (!item.devOnly) || (item.devOnly && process.env.ENVIRONMENT !== "production");
    
    if (hasAccess && showInEnv) {
      // Remove sensitive fields before sending to client
      const { customAccessFunction, accessRole, accessTeam, accessOverrideRole, ...serializableItem } = item;
      
      // Add badge if badgeSource is specified
      let badge: number | undefined;
      if (item.badgeSource) {
        const badgeResolver = badgeResolvers[item.badgeSource];
        if (badgeResolver) {
          try {
            badge = await badgeResolver(user);
          } catch (error) {
            console.error(`Badge resolver error for '${item.badgeSource}':`, error);
            badge = undefined; // fallback to no badge
          }
        } else {
          console.error(`Badge resolver '${item.badgeSource}' not found`);
        }
      }
      
      visibleItems.push({
        ...serializableItem,
        ...(badge !== undefined && { badge })
      });
    }
  }

  return visibleItems;
}

export async function generateBreadcrumbs(
  currentPath: string, 
  routeParams: Record<string, string> = {},
  userId?: string
): Promise<{ title: string; path: string }[]> {
  // Get all navigation items for breadcrumb matching
  const navItems = await prisma.navigationItem.findMany({
    where: { active: true },
    orderBy: { orderIndex: 'asc' }
  });
  
  const breadcrumbs: { title: string; path: string }[] = [];
  
  // Build breadcrumb chain by matching path segments
  const pathSegments = currentPath.split('/').filter(Boolean);
  let currentSegment = '';
  
  for (const segment of pathSegments) {
    currentSegment += `/${segment}`;
    
    // Find nav item that matches this path (including dynamic routes)
    const navItem = navItems.find(item => 
      item.path === currentSegment || 
      matchesDynamicRoute(item.path, currentSegment)
    );
    
    if (navItem) {
      let title = navItem.title;
      
      // Resolve dynamic title if needed
      if (navItem.breadcrumbResolver) {
        const resolver = breadcrumbResolvers[navItem.breadcrumbResolver];
        if (resolver) {
          try {
            title = await resolver(routeParams, userId);
          } catch (error) {
            console.error('Breadcrumb resolver error:', error);
            title = navItem.title; // fallback to static title
          }
        }
      }
      
      breadcrumbs.push({ title, path: currentSegment });
    }
  }
  
  return breadcrumbs;
}

function matchesDynamicRoute(pattern: string, path: string): boolean {
  const patternSegments = pattern.split('/');
  const pathSegments = path.split('/');
  
  if (patternSegments.length !== pathSegments.length) return false;
  
  return patternSegments.every((segment, index) => {
    return segment.startsWith(':') || segment === pathSegments[index];
  });
}