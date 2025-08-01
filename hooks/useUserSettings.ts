import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usersApi } from '@/lib/apiClient';
import { UserSettings } from '@/lib/types';

export function useUserSettings() {
    const { data: session } = useSession();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) {
            setLoading(false);
            return;
        }

        const fetchSettings = async () => {
            try {
                const response = await usersApi.getUserSettings(session.user.id);
                setSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch user settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [session?.user?.id]);

    // Default settings if none exist or user not logged in
    const effectiveSettings = settings || {
        language: 'en',
        dateFormat: 'YYYYMMDD' as const,
        timeFormat: 'TWENTY_FOUR' as const,
        emailNotifications: false,
    };

    return {
        settings: effectiveSettings,
        loading,
        isLoggedIn: !!session?.user?.id
    };
}