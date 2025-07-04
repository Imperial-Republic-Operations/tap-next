'use client'

import { useEffect, useState } from "react";
import { fetchFactions, OrganizationDetailsWithChildren } from "@/lib/_organizations";
import Pagination from "@/components/Pagination";

export default function FactionList({ status }: { status: 'authenticated' | 'unauthenticated' }) {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [factions, setFactions] = useState<OrganizationDetailsWithChildren[]>([]);

    const getType = (org: OrganizationDetailsWithChildren): string => {
        return org.type.substring(0, 1) + org.type.substring(1).toLowerCase();
    }

    const loadFactions = async (pageNumber: number) => {
        const {factions, totalPages} = await fetchFactions(pageNumber);
        setFactions(factions);
        setTotalPages(totalPages);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadFactions(newPage);
    }

    useEffect(() => {
        loadFactions(page); // Immediately call the async function
    }, [page]);

    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
                <h2 className="text-2xl/7 font-semibold">Faction List</h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {factions.map((faction) => {
                    const leader = faction.members.find(
                        (member) => member.position?.accessType === 'ORGANIZATION_LEADER'
                    );

                    return (
                        <li key={faction.id} className="relative flex justify-between gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auo">
                                    <p className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                        {status === 'authenticated' ? (
                                            <a href={`/organizations/${faction.id}`}>{faction.name}</a>
                                        ) : faction.name}
                                    </p>
                                    <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">
                                        Leader: {leader?.rank?.name ?? ''} {leader?.character.name ?? 'N/a'}
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
                    );
                })}
            </ul>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
    );
}