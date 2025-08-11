'use client';

import { useEffect, useState } from 'react';
import { PoliticsHubData, Senator } from '@/lib/types';
import { useFormatting } from "@/hooks/useFormatting";
import { politicsApi } from '@/lib/apiClient';
import CreateSenatorModal from './CreateSenatorModal';

interface PoliticsDashboardProps {
    userId?: string;
}

export default function PoliticsDashboard({ userId }: PoliticsDashboardProps) {
    const [data, setData] = useState<PoliticsHubData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userHasSenator, setUserHasSenator] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { t } = useFormatting();

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                
                // Fetch politics data
                const response = await politicsApi.getPoliticsHub();
                
                setData(response.data);

                // Check if user has a senator
                if (userId) {
                    const hasUserSenator = response.data.senators.some((senator: Senator) => 
                        senator.user?.id === userId
                    );
                    setUserHasSenator(hasUserSenator);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        void loadData();
    }, [userId]);

    // Function to sort senators by committee and chair status
    const sortedSenators = data?.senators ? [...data.senators].sort((a, b) => {
        // First sort by committee name (null committees last)
        if (a.committee && !b.committee) return -1;
        if (!a.committee && b.committee) return 1;
        if (!a.committee && !b.committee) return a.name.localeCompare(b.name);
        
        if (a.committee && b.committee) {
            const committeeCompare = a.committee.name.localeCompare(b.committee.name);
            if (committeeCompare !== 0) return committeeCompare;
        }

        // Within same committee, sort by chair status
        const getChairRank = (senator: Senator) => {
            if (senator.chairCommittee) return 1;
            if (senator.viceChairCommittee) return 2;
            return 3;
        };

        const rankA = getChairRank(a);
        const rankB = getChairRank(b);
        
        if (rankA !== rankB) return rankA - rankB;
        
        // Finally sort by name
        return a.name.localeCompare(b.name);
    }) : [];

    // Group senators by committee
    const senatorsByCommittee = sortedSenators.reduce((acc, senator) => {
        const committeeName = senator.committee?.name || t.politics.noCommittee;
        if (!acc[committeeName]) {
            acc[committeeName] = [];
        }
        acc[committeeName].push(senator);
        return acc;
    }, {} as Record<string, Senator[]>);

    const handleCreateSenatorSuccess = async () => {
        setShowCreateModal(false);
        setUserHasSenator(true);
        
        // Reload data to show the new senator
        try {
            const response = await politicsApi.getPoliticsHub();
            setData(response.data);
        } catch (err) {
            console.error('Failed to reload data after senator creation:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-lg">{t.common.loading}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-red-600 dark:text-red-400">{t.common.error}: {error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t.politics.dashboard}
                </h1>
                {userId && !userHasSenator && (
                    <button 
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => setShowCreateModal(true)}
                    >
                        {t.politics.createSenator}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Senate Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {t.politics.senate}
                    </h2>
                    
                    {Object.entries(senatorsByCommittee).map(([committeeName, senators]) => (
                        <div key={committeeName} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                {committeeName}
                            </h3>
                            
                            <div className="space-y-3">
                                {senators.map((senator) => (
                                    <div key={senator.id.toString()} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {senator.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {senator.planet.name}
                                                {senator.user && (
                                                    <span> • {senator.user.name}</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            {senator.chairCommittee && (
                                                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium rounded">
                                                    {t.politics.committeeChair}
                                                </span>
                                            )}
                                            {senator.viceChairCommittee && (
                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium rounded">
                                                    {t.politics.committeeViceChair}
                                                </span>
                                            )}
                                            {!senator.chairCommittee && !senator.viceChairCommittee && (
                                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium rounded">
                                                    {t.politics.committeeMember}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* High Council Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {t.politics.highCouncil}
                    </h2>

                    {data?.highCouncil ? (
                        <div className="space-y-4">
                            {/* Chairman */}
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    {t.politics.highCouncilLeadership}
                                </h3>
                                
                                <div className="space-y-3">
                                    {data.highCouncil.chairman && (
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {data.highCouncil.chairman.character.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {data.highCouncil.chairman.character.user.name}
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium rounded">
                                                {t.politics.chairman}
                                            </span>
                                        </div>
                                    )}

                                    {data.highCouncil.viceChairman && (
                                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {data.highCouncil.viceChairman.character.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {data.highCouncil.viceChairman.character.user.name}
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium rounded">
                                                {t.politics.viceChairman}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* High Councilors */}
                            {data.highCouncil.councilors.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        {t.politics.councilors}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {data.highCouncil.councilors.map((councilor) => (
                                            <div key={councilor.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {councilor.character.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {councilor.character.user.name}
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium rounded">
                                                    {t.politics.councilors}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Honorary High Councilors */}
                            {data.highCouncil.honoraryCouncilors.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        {t.politics.honoraryCouncilors}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {data.highCouncil.honoraryCouncilors.map((councilor) => (
                                            <div key={councilor.id} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {councilor.character.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {councilor.character.user.name}
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium rounded">
                                                    {t.politics.honoraryCouncilors}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <p className="text-gray-500 dark:text-gray-400">
                                No High Council data available.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <CreateSenatorModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSenatorSuccess}
                userId={userId}
            />
        </div>
    );
}