'use client';

import { useState, useEffect } from 'react';
import { teamsApi } from '@/lib/apiClient';

interface Team {
    id: string;
    name: string;
    abbreviation: string;
}

interface ManageTeamsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
    onSuccess: () => void;
}

export default function ManageTeamsModal({ isOpen, onClose, userId, userName, onSuccess }: ManageTeamsModalProps) {
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [userTeams, setUserTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, userId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [allTeamsRes, userTeamsRes] = await Promise.all([
                teamsApi.getAllTeams(),
                teamsApi.getUserTeams(userId)
            ]);
            
            setAllTeams(allTeamsRes.data);
            setUserTeams(userTeamsRes.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load teams');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToTeam = async (teamId: string) => {
        setUpdating(teamId);
        try {
            await teamsApi.addUserToTeam(userId, teamId);
            await loadData(); // Reload to update the teams
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add user to team');
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveFromTeam = async (teamId: string) => {
        setUpdating(teamId);
        try {
            await teamsApi.removeUserFromTeam(userId, teamId);
            await loadData(); // Reload to update the teams
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to remove user from team');
        } finally {
            setUpdating(null);
        }
    };

    const isUserInTeam = (teamId: string) => {
        return userTeams.some(team => team.id === teamId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Manage Teams for {userName}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 rounded">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                    Current Teams ({userTeams.length})
                                </h3>
                                {userTeams.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        User is not a member of any teams.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {userTeams.map((team) => (
                                            <div key={team.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {team.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {team.abbreviation}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromTeam(team.id)}
                                                    disabled={updating === team.id}
                                                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded transition-colors"
                                                >
                                                    {updating === team.id ? 'Removing...' : 'Remove'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                                    Available Teams
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {allTeams
                                        .filter(team => !isUserInTeam(team.id))
                                        .map((team) => (
                                            <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {team.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {team.abbreviation}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToTeam(team.id)}
                                                    disabled={updating === team.id}
                                                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded transition-colors"
                                                >
                                                    {updating === team.id ? 'Adding...' : 'Add'}
                                                </button>
                                            </div>
                                        ))}
                                </div>
                                {allTeams.filter(team => !isUserInTeam(team.id)).length === 0 && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        User is already a member of all available teams.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}