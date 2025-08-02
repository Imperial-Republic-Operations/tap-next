'use client';

import { useState, useEffect } from 'react';
import { SecurityClearanceWithCharacters } from '@/lib/types';
import { organizationsApi } from '@/lib/apiClient';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SecurityClearancesPage() {
    const [clearances, setClearances] = useState<SecurityClearanceWithCharacters[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newClearanceName, setNewClearanceName] = useState('');
    const [newClearanceTier, setNewClearanceTier] = useState<number>(1);

    useEffect(() => {
        fetchClearances();
    }, []);

    const fetchClearances = async () => {
        try {
            const response = await organizationsApi.getSecurityClearances();
            setClearances(response.data);
        } catch (error) {
            console.error('Error fetching clearances:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClearance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClearanceName.trim()) return;

        try {
            const response = await organizationsApi.createSecurityClearance({
                name: newClearanceName,
                tier: newClearanceTier,
            });
            setClearances(response.data);
            setNewClearanceName('');
            setNewClearanceTier(1);
            setShowAddForm(false);
        } catch (error) {
            console.error('Error creating clearance:', error);
        }
    };

    const handleTierUpdate = async (id: bigint, newTier: number) => {
        try {
            const response = await organizationsApi.updateSecurityClearanceTier(id, newTier);
            setClearances(response.data);
        } catch (error) {
            console.error('Error updating clearance tier:', error);
        }
    };

    const moveClearanceUp = (clearance: SecurityClearanceWithCharacters) => {
        handleTierUpdate(clearance.id, clearance.tier + 1);
    };

    const moveClearanceDown = (clearance: SecurityClearanceWithCharacters) => {
        handleTierUpdate(clearance.id, clearance.tier - 1);
    };

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
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl/7 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldCheckIcon className="h-7 w-7 text-gray-400" />
                            Security Clearances
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage security clearance levels and their tier ordering
                        </p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add New Clearance
                        </button>
                    </div>
                </div>
            </div>

            {showAddForm && (
                <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md mb-6">
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleAddClearance} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Clearance Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newClearanceName}
                                    onChange={(e) => setNewClearanceName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="tier" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Tier Level
                                </label>
                                <input
                                    type="number"
                                    id="tier"
                                    value={newClearanceTier}
                                    onChange={(e) => setNewClearanceTier(parseInt(e.target.value))}
                                    min="1"
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Higher numbers represent higher clearance levels. Existing clearances at this tier and above will be shifted up.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                >
                                    Add Clearance
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="inline-flex items-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                        All Security Clearances (Ordered by Tier)
                    </h3>
                    
                    {clearances.length === 0 ? (
                        <div className="text-center py-12">
                            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No Security Clearances</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new security clearance.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                            {clearances.map((clearance, index) => (
                                <li
                                    key={clearance.id.toString()}
                                    className="flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {clearance.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {clearance.characters.length} character{clearance.characters.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => moveClearanceUp(clearance)}
                                            disabled={index === 0}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Move up (increase tier)"
                                        >
                                            <ArrowUpIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => moveClearanceDown(clearance)}
                                            disabled={index === clearances.length - 1}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Move down (decrease tier)"
                                        >
                                            <ArrowDownIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}