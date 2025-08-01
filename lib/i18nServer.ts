import { getTranslations, SupportedLanguage, Translations } from './i18n';

/**
 * Server-side function to get translations with user settings
 */
export async function getServerTranslations(userId?: string): Promise<Translations> {
    if (!userId) return getTranslations('en');
    
    try {
        const { prisma } = await import('@/lib/prisma');
        const userSettings = await prisma.userSettings.findUnique({
            where: { userId },
            select: { language: true }
        });
        
        return getTranslations((userSettings?.language || 'en') as SupportedLanguage);
    } catch {
        return getTranslations('en');
    }
}