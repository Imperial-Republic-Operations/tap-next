'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usersApi } from '@/lib/apiClient';
import { UserSettings } from '@/lib/types';

export default function UserSettingsPage() {
    const { data: session } = useSession();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchData = async () => {
            try {
                const [settingsResponse, charactersResponse] = await Promise.all([
                    usersApi.getUserSettings(session.user.id),
                    usersApi.getAllUserCharacters(session.user.id)
                ]);

                setSettings(settingsResponse.data);
                setCharacters(charactersResponse.data || []);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                setMessage({ type: 'error', text: 'Failed to load settings' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session?.user?.id || !settings) return;

        setSaving(true);
        setMessage(null);

        try {
            const formData = new FormData(e.currentTarget);
            const updatedSettings = {
                language: formData.get('language') as string,
                dateFormat: formData.get('dateFormat') as 'MMDDYYYY' | 'DDMMYYYY' | 'YYYYMMDD',
                timeFormat: formData.get('timeFormat') as 'TWELVE' | 'TWENTY_FOUR',
                emailNotifications: formData.has('emailNotifications'),
                defaultCharacterId: formData.get('defaultCharacterId') as string || null,
            };

            const response = await usersApi.updateUserSettings(session.user.id, updatedSettings);
            setSettings(response.data);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            console.error('Failed to update settings:', error);
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                        <div className="h-10 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center text-gray-400">
                    Please sign in to access settings.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">User Settings</h1>
                <p className="text-gray-400">Customize your TAP experience</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success' 
                        ? 'bg-green-900/50 border border-green-700 text-green-300'
                        : 'bg-red-900/50 border border-red-700 text-red-300'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Display Preferences */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Display Preferences</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                                Language
                            </label>
                            <select
                                id="language"
                                name="language"
                                defaultValue={settings?.language || 'en'}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-300 mb-2">
                                Date Format
                            </label>
                            <select
                                id="dateFormat"
                                name="dateFormat"
                                defaultValue={settings?.dateFormat || 'YYYYMMDD'}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="MMDDYYYY">MM/DD/YYYY</option>
                                <option value="DDMMYYYY">DD/MM/YYYY</option>
                                <option value="YYYYMMDD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-300 mb-2">
                                Time Format
                            </label>
                            <select
                                id="timeFormat"
                                name="timeFormat"
                                defaultValue={settings?.timeFormat || 'TWENTY_FOUR'}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TWELVE">12 Hour</option>
                                <option value="TWENTY_FOUR">24 Hour</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="defaultCharacterId" className="block text-sm font-medium text-gray-300 mb-2">
                                Default Character
                            </label>
                            <select
                                id="defaultCharacterId"
                                name="defaultCharacterId"
                                defaultValue={settings?.defaultCharacterId?.toString() || ''}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">No default character</option>
                                {characters.map((character) => (
                                    <option key={character.id} value={character.id.toString()}>
                                        {character.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="emailNotifications"
                                name="emailNotifications"
                                defaultChecked={settings?.emailNotifications || false}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-300">
                                Receive email notifications for important updates
                            </label>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}