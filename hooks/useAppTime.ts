import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const APPLICATION_TIMEZONE = 'America/Phoenix';

interface UseAppTimeReturn {
    formatAppTime: (date: Date, formatString?: string) => string;
    getAppTime: (date?: Date) => Date;
}

export const useAppTime = (): UseAppTimeReturn => {
    const formatAppTime = (date: Date, formatString: string = 'MMM d, yyyy h:mm a'): string => {
        const zonedDate = toZonedTime(date, APPLICATION_TIMEZONE);
        return format(zonedDate, formatString);
    };

    const getAppTime = (date: Date = new Date()): Date => {
        return toZonedTime(date, APPLICATION_TIMEZONE);
    };

    return {formatAppTime, getAppTime};
};