'use client';

import { useEffect, useState } from "react";
import { organizationsApi } from "@/lib/apiClient";
import { BuildingLibraryIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface OrganizationHierarchyProp {
    organization: {
        id: bigint;
        name: string;
        type: string;
        parent?: {
            id: bigint;
            name: string;
        } | null;
    };
}

export default function OrganizationHierarchy({ organization }: OrganizationHierarchyProp) {
    const [parents, setParents] = useState<any[]>([]);
    const [sisterOrgs, setSisterOrgs] = useState<{ id: bigint, name: string; abbreviation: string; }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const parentsResponse = await organizationsApi.getOrganizationParents(organization.id);
                const fetchedParents = parentsResponse.data;
                setParents(fetchedParents);

                if (organization.parent) {
                    const sisterResponse = await organizationsApi.getSisterOrganizations(organization.parent.id, organization.id);
                    setSisterOrgs(sisterResponse.data);
                }
            } catch (error) {
                console.error('Error fetching organization hierarchy data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [organization]);

    const breadcrumbs = [...parents].reverse();

    const getTypeDisplay = (type: string) => {
        return type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
    };

    if (loading) {
        return (
            <div className="mb-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            {breadcrumbs.length > 0 && (
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        {breadcrumbs.map((parent, index) => (
                            <li key={parent.id} className="inline-flex items-center">
                                {index > 0 && (
                                    <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
                                )}
                                <Link href={`/organizations/0{parent.id}`} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                                    <BuildingLibraryIcon className="w-4 h-4 mr-2" />
                                    {parent.name}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <div className="flex items-center">
                                <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-1" />
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                                    {organization.name}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
            )}

            {sisterOrgs.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Related {getTypeDisplay(organization.type)}s {organization.type !== 'UNIT' && 'and Units'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {sisterOrgs.map((sister) => (
                            <Link key={sister.id} href={`/organizations/${sister.id}`} className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <span className="font-medium text-xs text-gray-500 dark:text-gray-400 mr-2">
                                    {sister.abbreviation}
                                </span>
                                {sister.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}