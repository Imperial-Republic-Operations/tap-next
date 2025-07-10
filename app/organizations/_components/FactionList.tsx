'use client'

import { useEffect, useState } from "react";
import { fetchFactions, OrganizationWithTotalMembers } from "@/lib/_organizations";
import Pagination from "@/components/Pagination";
import { BuildingLibraryIcon, ChevronRightIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { classNames } from "@/lib/style";

export default function FactionList({ status }: { status: 'authenticated' | 'unauthenticated' }) {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [factions, setFactions] = useState<OrganizationWithTotalMembers[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFactions = async (pageNumber: number) => {
        setLoading(true);
        try {
            const {factions, totalPages} = await fetchFactions(pageNumber);
            setFactions(factions);
            setTotalPages(totalPages);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadFactions(newPage);
    }

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.key === 'ArrowLeft' || ((e.ctrlKey || e.metaKey) && e.key === 'a')) && page > 0) {
                handlePageChange(page - 1);
                e.preventDefault();
            }

            if ((e.key === 'ArrowRight' || ((e.ctrlKey || e.metaKey) && e.key === 'd')) && page + 1 < totalPages) {
                handlePageChange(page + 1);
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [page, totalPages]);

    useEffect(() => {
        loadFactions(page); // Immediately call the async function
    }, [page]);

    const FactionSkeleton = () => (
        <li className="relative flex justify-between gap-x-6 py-5 animate-pulse">
            <div className="flex min-w-0 gap-x-4">
                <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="min-w-0 flex-auto space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
            </div>
        </li>
    );

    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-800 pb-5 mb-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl/7 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <BuildingLibraryIcon className="h-7 w-7 text-gray-400" />
                            Galactic Factions
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Major political and military organizations across the galaxy
                        </p>
                    </div>
                    {status === 'authenticated' && false && (
                        <div className="mt-3 sm:mt-0">
                            <Link
                                href="/organizations/new"
                                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                Create Faction
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {loading ? (
                        Array.from({length: 5}, (_, i) => <FactionSkeleton key={i} />)
                    ) : factions.length === 0 ? (
                        <li className="px-6 py-12 text-center">
                            <BuildingLibraryIcon className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No factions</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No factions have been created yet.
                            </p>
                        </li>
                    ) : factions.map((faction) => {
                        const leader = faction.members.find(
                            (member) => member.position?.permissions.some((p) => p.value === 'LEADER')
                        );
                        const memberCount = faction.totalUniqueMembers;
                        const directMemberCount = faction.members.length;
                        const isActive = memberCount > 0;

                        /*return (
                            <li key={faction.id} className="relative flex justify-between gap-x-6 py-5">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auo">
                                        <p className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                            {status === 'authenticated' ? (
                                                <Link href={`/organizations/${faction.id}`}>{faction.name}</Link>
                                            ) : faction.name}
                                        </p>
                                        <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">
                                            Leader: {leader ? `${leader.rank?.name} ${leader.character.name}` : 'Vacant'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4">
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm/6 text-gray-900 dark:text-white">
                                            Type: {getType(faction)}
                                        </p>
                                        <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">
                                            {(faction.children ?? []).length} Suborganization{(faction.children ?? []).length === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );*/

                        return (
                            <li key={faction.id} className={classNames(status === 'authenticated' && 'hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors', 'relative')}>
                                {status === 'authenticated' ? (
                                    <Link href={`/organizations/${faction.id}`} className="block px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex min-w-0 gap-x-4">
                                                <div className={classNames(isActive ? 'bg-primary-600' : 'bg-gray-400', 'flex size-12 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white')}>
                                                    {faction.abbreviation.substring(0, 3)}
                                                </div>
                                                <div className="min-w-0 flex-auto">
                                                    <p className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                                        {faction.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500 dark:text-gray-400">
                                                        <UserGroupIcon className="h-3.5 w-3.5" />
                                                        Leader: {leader ? `${leader.rank?.name} ${leader.character.name}` : 'Vacant'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-x-4">
                                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                                    <p className="text-sm/6 text-gray-900 dark:text-white">
                                                        {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
                                                        {memberCount !== directMemberCount && (
                                                            <span className="text-xs text-gray-500 ml-1">
                                                                ({directMemberCount} direct)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-x-1 5">
                                                        <div className={classNames(isActive ? 'bg-emerald-500/20' : 'bg-gray-500/20', 'flex-none rounded-full p-1')}>
                                                            <div className={classNames(isActive ? 'bg-emerald-500' : 'bg-gray-500', 'h-1.5 w-1.5 rounded-full')} />
                                                        </div>
                                                        <p className="text-xs/5 text-gray-500 dark:text-gray-400">
                                                            {isActive ? 'Active' : 'Inactive'} • {(faction.children ?? []).length} Suborganization{(faction.children ?? []).length === 1 ? '' : 's'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex min-w-0 gap-x-4">
                                                <div className={classNames(isActive ? 'bg-primary-600' : 'bg-gray-400', 'flex size-12 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white')}>
                                                    {faction.abbreviation.substring(0, 3)}
                                                </div>
                                                <div className="min-w-0 flex-auto">
                                                    <p className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                                        {faction.name}
                                                    </p>
                                                    <p className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500 dark:text-gray-400">
                                                        <UserGroupIcon className="h-3.5 w-3.5" />
                                                        Leader: {leader ? `${leader.rank?.name} ${leader.character.name}` : 'Vacant'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-x-4">
                                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                                    <p className="text-sm/6 text-gray-900 dark:text-white">
                                                        {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
                                                        {memberCount !== directMemberCount && (
                                                            <span className="text-xs text-gray-500 ml-1">
                                                                ({directMemberCount} direct)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-x-1 5">
                                                        <div className={classNames(isActive ? 'bg-emerald-500/20' : 'bg-gray-500/20', 'flex-none rounded-full p-1')}>
                                                            <div className={classNames(isActive ? 'bg-emerald-500' : 'bg-gray-500', 'h-1.5 w-1.5 rounded-full')} />
                                                        </div>
                                                        <p className="text-xs/5 text-gray-500 dark:text-gray-400">
                                                            {isActive ? 'Active' : 'Inactive'} • {(faction.children ?? []).length} Suborganization{(faction.children ?? []).length === 1 ? '' : 's'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {!loading && factions.length > 0 && (
                <div className="mt-6">
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            )}
        </>
    );
}