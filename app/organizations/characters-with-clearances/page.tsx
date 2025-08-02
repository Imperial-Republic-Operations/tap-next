'use client';

import { useState, useEffect } from 'react';
import { CharacterWithClearance } from '@/lib/types';
import { organizationsApi } from '@/lib/apiClient';
import { UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function CharactersWithClearancesPage() {
    const [characters, setCharacters] = useState<CharacterWithClearance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const response = await organizationsApi.getCharactersWithClearances();
            setCharacters(response.data);
        } catch (error) {
            console.error('Error fetching characters with clearances:', error);
        } finally {
            setLoading(false);
        }
    };

    const groupedCharacters = characters.reduce((acc, character) => {
        if (!character.clearance) return acc;
        
        const tier = character.clearance.tier;
        if (!acc[tier]) {
            acc[tier] = {
                clearance: character.clearance,
                characters: []
            };
        }
        acc[tier].characters.push(character);
        return acc;
    }, {} as Record<number, { clearance: any, characters: CharacterWithClearance[] }>);

    // Sort tiers in descending order (highest clearance first)
    const sortedTiers = Object.keys(groupedCharacters)
        .map(Number)
        .sort((a, b) => b - a);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <h2 className="text-2xl/7 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <UserGroupIcon className="h-7 w-7 text-gray-400" />
                        Characters with Security Clearances
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        View all characters organized by their security clearance levels
                    </p>
                </div>
            </div>

            {characters.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
                    <div className="px-6 py-12 text-center">
                        <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-500" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No Characters with Clearances</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No characters have security clearances assigned yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedTiers.map((tier) => {
                        const group = groupedCharacters[tier];
                        return (
                            <div key={tier} className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                                        {group.clearance.name}
                                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                            ({group.characters.length} character{group.characters.length !== 1 ? 's' : ''})
                                        </span>
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {group.characters.map((character) => (
                                            <div
                                                key={character.id.toString()}
                                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {character.avatarLink ? (
                                                        <img
                                                            src={character.avatarLink}
                                                            alt={character.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                            <UserGroupIcon className="h-6 w-6 text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {character.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                                            {character.status.replace('_', ' ').toLowerCase()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}