'use client'

import { useEffect, useState } from "react";
import { fetchOrganizationMembers, OrganizationMember } from "@/lib/_organizations";
import Pagination from "@/components/Pagination";

export default function MembersList({ orgId }: {orgId: bigint}) {
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [members, setMembers] = useState<OrganizationMember[]>([]);

    const loadMembers = async (orgId: bigint, pageNumber: number) => {
        const {members, totalPages} = await fetchOrganizationMembers(orgId, pageNumber);
        setMembers(members);
        setTotalPages(totalPages);
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadMembers(orgId, newPage);
    }

    useEffect(() => {
        loadMembers(orgId, page);
    }, [orgId, page]);

    return (
        <div className="mb-3">
            <h2 className="text-sm font-medium text-gray-500">Members</h2>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {members.map((member) => (
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
                                <p className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                                    {member.character.name}
                                </p>
                                <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">
                                    Status: {member.character.status}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-x-4">
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                                <p className="text-sm/6 text-gray-900 dark:text-white">
                                    {member.position?.name ?? "No Position"}
                                </p>
                                <p className="mt-1 truncate text-xs/5 text-gray-500 dark:text-gray-400">
                                    Rank: {member.rank?.name ?? "None"}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}