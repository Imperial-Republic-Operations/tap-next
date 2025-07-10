'use client'

import { useCallback, useEffect, useState } from "react";
import { fetchOrganizationMembers, OrganizationMember } from "@/lib/_organizations";
import Pagination from "@/components/Pagination";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/lib/style";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

type FilterType = 'all' | 'leadership' | 'high command' | 'officers' | 'enlisted' | 'civilian';
type SortType = 'name' | 'rank' | 'position' | 'joined';

export default function MembersList({ orgId }: {orgId: bigint}) {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [members, setMembers] = useState<OrganizationMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('position');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const loadMembers = useCallback(async (pageNumber: number) => {
        setLoading(true);
        try {
            const {members, totalPages} = await fetchOrganizationMembers(orgId, pageNumber, {
                search: debouncedSearchTerm || undefined,
                filterType,
                sortBy,
            });
            setMembers(members);
            setTotalPages(totalPages);
        } finally {
            setLoading(false);
        }
    }, [orgId, debouncedSearchTerm, filterType, sortBy]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearchTerm, filterType, sortBy]);

    useEffect(() => {
        loadMembers(page);
    }, [page, loadMembers]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const getStatusBadge = (member: OrganizationMember) => {
        const hasLeadershipPerms = member.position?.permissions.some(p => ['LEADER', 'SECOND_IN_COMMAND', 'LEADERSHIP'].includes(p.value));

        if (hasLeadershipPerms) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Leadership
                </span>
            );
        }
        
        if (member.rank?.tier === 'HIGH_COMMAND') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                    High Command
                </span>
            )
        }

        if (member.rank?.tier === 'OFFICER' || member.rank?.tier === 'COMMAND') {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Officer
                </span>
            );
        }

        if (member.rank?.tier === 'ENLISTED') {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Enlisted
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Civilian
            </span>
        );
    };

    const getCharacterStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-600 dark:text-green-400';
            case 'INACTIVE':
                return 'text-gray-500 dark:text-gray-400';
            case 'DECEASED':
                return 'text-red-600 dark:text-red-400';
            case 'MISSING':
                return 'text-yellow-600 dark:text-yellow-400';
            case 'RETIRED':
                return 'text-blue-600 dark:text-blue-400';
            default:
                return 'text-gray-500 dark:text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="mb-3">
                <h2 className="text-sm font-medium text-gray-500 mb-4">Members</h2>
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="size-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="min-w-0 flex-auto space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-4">
                                <div className="hidden sm:flex sm:flex-col sm:items-end space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-500">Members</h2>
                <div className="text-sm text-gray-400">
                    Page {page + 1} of {totalPages}
                </div>
            </div>

            <div className="mb-4 space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as FilterType)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Members</option>
                        <option value="leadership">Leadership</option>
                        <option value="high command">High Command</option>
                        <option value="officers">Officers</option>
                        <option value="enlisted">Enlisted</option>
                        <option value="civilian">Civilian</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortType)}
                        className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="rank">Sort by Rank</option>
                        <option value="position">Sort by Position</option>
                        <option value="joined">Sort by Join Date</option>
                    </select>
                </div>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {members.length === 0 ? (
                    <li className="py-8 text-center">
                        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No members found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Try adjusting your search terms.' : 'No members match the current filter.'}
                        </p>
                    </li>
                ) : members.map((member) => (
                    <li key={member.id} className="flex justify-between gap-x-6 py-5">
                        <div className="flex min-w-0 gap-x-4">
                            {member.character.avatarLink ? (
                                <img
                                    className="size-12 rounded-full flex-none bg-gray-50 dark:bg-gray-800"
                                    src={member.character.avatarLink}
                                    alt={member.character.name} />
                            ) : (
                                <span className="inline-block size-12 overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800">
                                    <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                </span>
                            )}
                            <div className="min-w-0 flex-auto">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                        {member.character.name}
                                    </p>
                                    {getStatusBadge(member)}
                                </div>
                                <p className={classNames(getCharacterStatusColor(member.character.status), 'mt-1 truncate text-xs')}>
                                    Status: {member.character.status}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-x-4">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <p className="text-sm/6 text-gray-900 dark:text-white">
                                    {member.position?.name ?? "Member"}
                                </p>
                                <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">
                                    Rank: {member.rank?.name ?? "None"}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {!loading && totalPages > 1 && (
                /*<div className="mt-4">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>*/
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    );
}