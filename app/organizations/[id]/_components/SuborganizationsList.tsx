'use client';

import { useEffect, useState } from "react";
import { organizationsApi } from "@/lib/apiClient";

type SuborganizationData = {
  id: bigint;
  name: string;
  abbreviation: string;
  members: any[];
};

interface SuborganizationsListProps {
    subOrgs: SuborganizationData[];
}

export default function SuborganizationsList({ subOrgs }: SuborganizationsListProps) {
    const [childrenWithTotalMembers, setChildrenWithTotalMembers] = useState<(SuborganizationData & { totalMembers: number; directMembers: number })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberCounts = async () => {
            try {
                const results = await Promise.all(
                    subOrgs.map(async (child) => {
                        const response = await organizationsApi.getUniqueCharacterCountByOrgId(child.id);
                        const totalMembers = response.data;
                        return { ...child, totalMembers, directMembers: child.members.length };
                    })
                );
                setChildrenWithTotalMembers(results);
            } catch (error) {
                console.error('Error fetching member counts:', error);
                setChildrenWithTotalMembers(subOrgs.map(child => ({ ...child, totalMembers: child.members.length, directMembers: child.members.length })));
            } finally {
                setLoading(false);
            }
        };

        fetchMemberCounts();
    }, [subOrgs]);

    if (loading) {
        return (
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {subOrgs.map((sub) => (
                    <li key={sub.id} className="col-span-1 flex rounded-md shadow-xs animate-pulse">
                        <div className="flex w-16 shrink-0 items-center justify-center rounded-l-md bg-gray-300 text-sm font-medium">
                            <div className="h-4 bg-gray-400 rounded w-8"></div>
                        </div>
                        <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                            <div className="flex-1 truncate px-4 py-2 text-sm">
                                <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </li>
                ))}
            </div>
        );
    }

    return (
        <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {childrenWithTotalMembers.map((sub) => (
                <li key={sub.id} className="col-span-1 flex rounded-md shadow-xs">
                    <div className="flex w-16 shrink-0 items-center justify-center rounded-l-md bg-violet-600 text-sm font-medium text-white">
                        {sub.abbreviation.substring(0, 5)}
                    </div>
                    <div
                        className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                            <a href={`/organizations/${sub.id}`}
                               className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">{sub.name}</a>
                            <p className="text-gray-500">
                                {sub.totalMembers} Member{sub.totalMembers !== 1 ? "s" : ""}
                                {sub.totalMembers !== sub.directMembers && (
                                    <span className="text-xs ml-1">
                                        ({sub.directMembers} direct)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}