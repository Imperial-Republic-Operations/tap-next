import { fetchPendingCharacters } from "@/lib/_characters";
import { fetchUnreadNotificationCount } from "@/lib/_notifications";

// Badge resolver function type
export type BadgeResolver = (user: any) => Promise<number>;

// Registry of badge resolver functions
export const badgeResolvers: Record<string, BadgeResolver> = {
  // Characters
  pending_characters: async (user: any) => {
    try {
      const result = await fetchPendingCharacters(0);
      return result.totalCount;
    } catch (error) {
      console.error('Failed to fetch pending character count:', error);
      return 0;
    }
  },

  // Notifications
  unread_notifications: async (user: any) => {
    if (!user?.id) return 0;
    try {
      return await fetchUnreadNotificationCount(user.id);
    } catch (error) {
      console.error('Failed to fetch unread notification count:', error);
      return 0;
    }
  },

  // Add more badge resolvers as needed
  // Example for future use:
  // pending_documents: async (user: any) => {
  //   // Implementation for pending documents count
  //   return 0;
  // },
};