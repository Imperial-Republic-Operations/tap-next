import { useUserSettings } from './useUserSettings';
import { useTranslations } from '@/lib/i18n';
import { formatTimestamp, formatTimestampTime, formatFullTimestamp, formatTimestampShort, formatTimeWithSeconds } from '@/lib/formatters';

export function useFormatting() {
    const { settings } = useUserSettings();
    const t = useTranslations(settings.language as any);

    // Bound formatting functions using user's preferences
    const formatDate = (date: Date | string) => formatTimestamp(date, settings.dateFormat);
    const formatTime = (date: Date | string) => formatTimestampTime(date, settings.timeFormat);
    const formatTimeSeconds = (date: Date | string) => formatTimeWithSeconds(date, settings.timeFormat);
    const formatDateTime = (date: Date | string) => formatFullTimestamp(date, settings.dateFormat, settings.timeFormat);
    const formatDateShort = (date: Date | string) => formatTimestampShort(date, settings.dateFormat, settings.timeFormat);

    // Relative time formatting
    const formatRelativeTime = (date: Date | string): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffInMs = now.getTime() - d.getTime();
        
        const minutes = Math.floor(diffInMs / (1000 * 60));
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (minutes < 1) return t.time.justNow;
        if (minutes < 60) return `${minutes} ${t.time.minutesAgo}`;
        if (hours < 24) return `${hours} ${t.time.hoursAgo}`;
        if (days < 7) return `${days} ${t.time.daysAgo}`;
        if (weeks < 4) return `${weeks} ${t.time.weeksAgo}`;
        if (months < 12) return `${months} ${t.time.monthsAgo}`;
        return `${years} ${t.time.yearsAgo}`;
    };

    return {
        // User settings
        settings,
        
        // Translations
        t,
        
        // Formatting functions
        formatDate,
        formatTime,
        formatTimeSeconds,
        formatDateTime,
        formatDateShort,
        formatRelativeTime,
    };
}