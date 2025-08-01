'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { charactersApi } from '@/lib/apiClient';
import { CheckIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface PendingCharacter {
    id: string;
    name: string;
    approvalStatus: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    species: {
        name: string;
    };
    homeworld: {
        name: string;
    };
}

interface PendingCharactersData {
    characters: PendingCharacter[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

export default function PendingCharacters() {
    const { data: session } = useSession();
    const [data, setData] = useState<PendingCharactersData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [processingCharacter, setProcessingCharacter] = useState<string | null>(null);

    const loadPendingCharacters = async (page: number = 0) => {
        try {
            setLoading(true);
            const response = await charactersApi.getPendingCharacters(page);
            setData(response.data);
            setCurrentPage(page);
        } catch (err) {
            setError('Failed to load pending characters');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            loadPendingCharacters();
        }
    }, [session]);

    const handleApproval = async (characterId: string, action: 'approve' | 'reject') => {
        try {
            setProcessingCharacter(characterId);
            
            if (action === 'approve') {
                await charactersApi.approveCharacter(BigInt(characterId));
            } else {
                await charactersApi.rejectCharacter(BigInt(characterId));
            }
            
            // Reload the current page
            await loadPendingCharacters(currentPage);
        } catch (err: any) {
            console.error('Error updating character status:', err);
            setError(err.response?.data?.error || 'Failed to update character status');
        } finally {
            setProcessingCharacter(null);
        }
    };

    if (loading && !data) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
                    <button 
                        onClick={() => {
                            setError(null);
                            loadPendingCharacters(currentPage);
                        }}
                        className="mt-2 text-sm font-medium text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Characters</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Characters awaiting approval ({data?.totalCount || 0} total)
                    </p>
                </div>
            </div>

            {!data || data.characters.length === 0 ? (
                <div className="mt-8 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <CheckIcon />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No pending characters</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All characters have been reviewed.</p>
                </div>
            ) : (
                <>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Character
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Player
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Species & Homeworld
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Submitted
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {data.characters.map((character) => (
                                                <tr key={character.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {character.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {character.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {character.user.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-white">
                                                            {character.species.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {character.homeworld.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(character.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Link
                                                                href={`/characters/${character.id}`}
                                                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                            >
                                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() => handleApproval(character.id, 'approve')}
                                                                disabled={processingCharacter === character.id}
                                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <CheckIcon className="h-4 w-4 mr-1" />
                                                                {processingCharacter === character.id ? 'Processing...' : 'Approve'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproval(character.id, 'reject')}
                                                                disabled={processingCharacter === character.id}
                                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <XMarkIcon className="h-4 w-4 mr-1" />
                                                                {processingCharacter === character.id ? 'Processing...' : 'Reject'}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6 mt-4">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button
                                    onClick={() => loadPendingCharacters(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => loadPendingCharacters(currentPage + 1)}
                                    disabled={currentPage >= data.totalPages - 1}
                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                        <span className="font-medium">{data.totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                        <button
                                            onClick={() => loadPendingCharacters(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => loadPendingCharacters(currentPage + 1)}
                                            disabled={currentPage >= data.totalPages - 1}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}