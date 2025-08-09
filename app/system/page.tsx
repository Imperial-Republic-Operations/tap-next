'use client';

import { useState, useEffect } from 'react';
import { systemApi } from '@/lib/apiClient';
import { SenateSettings, HighCouncilSettings, TeamsSettings } from '@/lib/types';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SystemSettingsPage() {
    const [senateSettings, setSenateSettings] = useState<SenateSettings | null>(null);
    const [highCouncilSettings, setHighCouncilSettings] = useState<HighCouncilSettings | null>(null);
    const [teamsSettings, setTeamsSettings] = useState<TeamsSettings | null>(null);
    const [loading, setLoading] = useState({
        senate: true,
        highCouncil: true,
        teams: true
    });
    const [saving, setSaving] = useState({
        senate: false,
        highCouncil: false,
        teams: false
    });
    const [saveSuccess, setSaveSuccess] = useState({
        senate: false,
        highCouncil: false,
        teams: false
    });

    // Load all settings on component mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [senateRes, highCouncilRes, teamsRes] = await Promise.all([
                    systemApi.getSenateSettings(),
                    systemApi.getHighCouncilSettings(),
                    systemApi.getTeamsSettings()
                ]);

                setSenateSettings(senateRes.data);
                setHighCouncilSettings(highCouncilRes.data);
                setTeamsSettings(teamsRes.data);
            } catch (error) {
                console.error('Failed to load system settings:', error);
            } finally {
                setLoading({ senate: false, highCouncil: false, teams: false });
            }
        };

        loadSettings();
    }, []);

    const handleSaveSenate = async (data: any) => {
        setSaving(prev => ({ ...prev, senate: true }));
        try {
            const response = await systemApi.updateSenateSettings(data);
            setSenateSettings(response.data);
            setSaveSuccess(prev => ({ ...prev, senate: true }));
            setTimeout(() => setSaveSuccess(prev => ({ ...prev, senate: false })), 2000);
        } catch (error) {
            console.error('Failed to save senate settings:', error);
        } finally {
            setSaving(prev => ({ ...prev, senate: false }));
        }
    };

    const handleSaveHighCouncil = async (data: any) => {
        setSaving(prev => ({ ...prev, highCouncil: true }));
        try {
            const response = await systemApi.updateHighCouncilSettings(data);
            setHighCouncilSettings(response.data);
            setSaveSuccess(prev => ({ ...prev, highCouncil: true }));
            setTimeout(() => setSaveSuccess(prev => ({ ...prev, highCouncil: false })), 2000);
        } catch (error) {
            console.error('Failed to save high council settings:', error);
        } finally {
            setSaving(prev => ({ ...prev, highCouncil: false }));
        }
    };

    const handleSaveTeams = async (data: any) => {
        setSaving(prev => ({ ...prev, teams: true }));
        try {
            const response = await systemApi.updateTeamsSettings(data);
            setTeamsSettings(response.data);
            setSaveSuccess(prev => ({ ...prev, teams: true }));
            setTimeout(() => setSaveSuccess(prev => ({ ...prev, teams: false })), 2000);
        } catch (error) {
            console.error('Failed to save teams settings:', error);
        } finally {
            setSaving(prev => ({ ...prev, teams: false }));
        }
    };

    return (
        <div className="space-y-8">
            {/* Senate Settings Applet */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Senate Settings
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Configure positions for Senate leadership roles.
                    </p>
                </div>
                <div className="p-6">
                    {loading.senate ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ) : (
                        <SenateSettingsForm
                            settings={senateSettings}
                            onSave={handleSaveSenate}
                            saving={saving.senate}
                            saveSuccess={saveSuccess.senate}
                        />
                    )}
                </div>
            </div>

            {/* High Council Settings Applet */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        High Council Settings
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Configure positions for High Council leadership roles.
                    </p>
                </div>
                <div className="p-6">
                    {loading.highCouncil ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ) : (
                        <HighCouncilSettingsForm
                            settings={highCouncilSettings}
                            onSave={handleSaveHighCouncil}
                            saving={saving.highCouncil}
                            saveSuccess={saveSuccess.highCouncil}
                        />
                    )}
                </div>
            </div>

            {/* Teams Settings Applet */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Teams Settings
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Configure teams for different administrative functions.
                    </p>
                </div>
                <div className="p-6">
                    {loading.teams ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ) : (
                        <TeamsSettingsForm
                            settings={teamsSettings}
                            onSave={handleSaveTeams}
                            saving={saving.teams}
                            saveSuccess={saveSuccess.teams}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Senate Settings Form Component
function SenateSettingsForm({ settings, onSave, saving, saveSuccess }: {
    settings: SenateSettings | null;
    onSave: (data: any) => void;
    saving: boolean;
    saveSuccess: boolean;
}) {
    const [formData, setFormData] = useState({
        supremeRulerPositionId: '',
        presidentPositionId: '',
        vicePresidentPositionId: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                supremeRulerPositionId: settings.supremeRulerPositionId.toString(),
                presidentPositionId: settings.presidentPositionId.toString(),
                vicePresidentPositionId: settings.vicePresidentPositionId.toString()
            });
        }
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supreme Ruler Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.supremeRulerPosition.name} ({settings?.supremeRulerPosition.organization.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    President Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.presidentPosition.name} ({settings?.presidentPosition.organization.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vice President Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.vicePresidentPosition.name} ({settings?.vicePresidentPosition.organization.abbreviation})
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : saveSuccess ? (
                        <>
                            <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                            Saved!
                        </>
                    ) : (
                        'Save Senate Settings'
                    )}
                </button>
            </div>
        </form>
    );
}

// High Council Settings Form Component
function HighCouncilSettingsForm({ settings, onSave, saving, saveSuccess }: {
    settings: HighCouncilSettings | null;
    onSave: (data: any) => void;
    saving: boolean;
    saveSuccess: boolean;
}) {
    const [formData, setFormData] = useState({
        chairmanPositionId: '',
        viceChairmanPositionId: '',
        highCouncilorPositionId: '',
        honoraryHighCouncilorPositionId: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                chairmanPositionId: settings.chairmanPositionId.toString(),
                viceChairmanPositionId: settings.viceChairmanPositionId.toString(),
                highCouncilorPositionId: settings.highCouncilorPositionId.toString(),
                honoraryHighCouncilorPositionId: settings.honoraryHighCouncilorPositionId.toString()
            });
        }
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chairman Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.chairmanPosition.name} ({settings?.chairmanPosition.organization.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vice Chairman Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.viceChairmanPosition.name} ({settings?.viceChairmanPosition.organization.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    High Councilor Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.highCouncilorPosition.name} ({settings?.highCouncilorPosition.organization.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Honorary High Councilor Position
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.honoraryHighCouncilorPosition.name} ({settings?.honoraryHighCouncilorPosition.organization.abbreviation})
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : saveSuccess ? (
                        <>
                            <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                            Saved!
                        </>
                    ) : (
                        'Save High Council Settings'
                    )}
                </button>
            </div>
        </form>
    );
}

// Teams Settings Form Component
function TeamsSettingsForm({ settings, onSave, saving, saveSuccess }: {
    settings: TeamsSettings | null;
    onSave: (data: any) => void;
    saving: boolean;
    saveSuccess: boolean;
}) {
    const [formData, setFormData] = useState({
        characterTeamId: '',
        moderationTeamId: '',
        forceTeamId: '',
        operationsTeamId: '',
        publicationTeamId: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                characterTeamId: settings.characterTeamId.toString(),
                moderationTeamId: settings.moderationTeamId.toString(),
                forceTeamId: settings.forceTeamId.toString(),
                operationsTeamId: settings.operationsTeamId.toString(),
                publicationTeamId: settings.publicationTeamId.toString()
            });
        }
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Character Team
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.characterTeam.name} ({settings?.characterTeam.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Moderation Team
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.moderationTeam.name} ({settings?.moderationTeam.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Force Team
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.forceTeam.name} ({settings?.forceTeam.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Operations Team
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.operationsTeam.name} ({settings?.operationsTeam.abbreviation})
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publication Team
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {settings?.publicationTeam.name} ({settings?.publicationTeam.abbreviation})
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : saveSuccess ? (
                        <>
                            <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                            Saved!
                        </>
                    ) : (
                        'Save Teams Settings'
                    )}
                </button>
            </div>
        </form>
    );
}