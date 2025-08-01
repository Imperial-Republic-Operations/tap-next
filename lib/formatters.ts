// Formatting utilities based on user preferences

export type DateFormat = 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD';
export type TimeFormat = 'TWELVE' | 'TWENTY_FOUR';

/**
 * Format a timestamp according to user's preferred date format
 * Used for createdAt, updatedAt fields from database
 */
export function formatTimestamp(date: Date | string, format: DateFormat = 'YYYYMMDD'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString();
    
    switch (format) {
        case 'MMDDYYYY':
            return `${month}/${day}/${year}`;
        case 'DDMMYYYY':
            return `${day}/${month}/${year}`;
        case 'YYYYMMDD':
        default:
            return `${year}-${month}-${day}`;
    }
}

/**
 * Format a timestamp's time according to user's preferred time format
 */
export function formatTimestampTime(date: Date | string, format: TimeFormat = 'TWENTY_FOUR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'TWELVE') {
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } else {
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}

/**
 * Format a timestamp's time with seconds according to user's preferred time format
 * Used for live updating clocks like breadcrumb
 */
export function formatTimeWithSeconds(date: Date | string, format: TimeFormat = 'TWENTY_FOUR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (format === 'TWELVE') {
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    } else {
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
}

/**
 * Format a complete timestamp (date + time) according to user preferences
 */
export function formatFullTimestamp(
    date: Date | string, 
    dateFormat: DateFormat = 'YYYYMMDD', 
    timeFormat: TimeFormat = 'TWENTY_FOUR'
): string {
    return `${formatTimestamp(date, dateFormat)} ${formatTimestampTime(date, timeFormat)}`;
}

/**
 * Format a timestamp for display in lists (shorter format)
 * Shows time if today, date if this year, full date otherwise
 */
export function formatTimestampShort(date: Date | string, dateFormat: DateFormat = 'YYYYMMDD', timeFormat: TimeFormat = 'TWENTY_FOUR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    // If it's today, just show time
    if (d.toDateString() === today.toDateString()) {
        return formatTimestampTime(d, timeFormat);
    }
    
    // If it's this year, show month/day
    if (d.getFullYear() === today.getFullYear()) {
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        
        switch (dateFormat) {
            case 'MMDDYYYY':
                return `${month}/${day}`;
            case 'DDMMYYYY':
                return `${day}/${month}`;
            case 'YYYYMMDD':
            default:
                return `${month}-${day}`;
        }
    }
    
    // Otherwise show full date
    return formatTimestamp(d, dateFormat);
}