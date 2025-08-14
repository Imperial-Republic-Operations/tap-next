'use client'

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from "next/link";
import { useAppTime } from "@/hooks/useAppTime";
import { useFormatting } from '@/hooks/useFormatting';
import { navigationApi } from '@/lib/apiClient';

interface StaticDateInfo {
    gameMonth: string;
    gameYear: number;
    era: string;
    day: number;
}

interface BreadcrumbItem {
    title: string;
    path: string;
}

export default function Breadcrumb({ staticDateInfo }: { staticDateInfo: StaticDateInfo }) {
    const pathname = usePathname();
    const params = useParams();
    const { getAppTime } = useAppTime();
    const { formatTimeSeconds, t } = useFormatting();

    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = getAppTime();
            setCurrentTime(formatTimeSeconds(now));
        };

        updateTime();

        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [getAppTime]);

    useEffect(() => {
        const generateBreadcrumbs = async () => {
            if (pathname === '/') {
                setBreadcrumbs([]);
                return;
            }

            try {
                // Convert route params to string record for API call
                const routeParams: Record<string, string> = {};
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (typeof value === 'string') {
                            routeParams[key] = value;
                        } else if (Array.isArray(value)) {
                            routeParams[key] = value[0] || '';
                        }
                    });
                }

                // Use the proper API client instead of raw fetch
                const response = await navigationApi.generateBreadcrumbs(pathname, routeParams);
                setBreadcrumbs(response.data.breadcrumbs || []);
            } catch (error) {
                console.error('Error generating breadcrumbs:', error);
                setBreadcrumbs([]);
            }
        };

        generateBreadcrumbs();
    }, [pathname, params]);

    useEffect(() => {
        // Update document title based on current page
        const currentPageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : "Home";
        document.title = `${currentPageTitle} | Terminal Access Project`;
    }, [breadcrumbs]);

    const inGameDate = `${staticDateInfo.gameMonth} ${staticDateInfo.day}, ${staticDateInfo.gameYear} ${staticDateInfo.era} ${currentTime}`;

    return (
        <nav className="flex border-t border-b border-gray-200 bg-white dark:border-gray-500 dark:bg-gray-800"
             aria-label="Breadcrumb">
            <ol className="mx-auto flex w-full max-w-(--breakpoint-xl) space-x-4 px-4 sm:px-6 lg:px-8">
                <li className="flex">
                    <div className="flex items-center">
                        <Link href="/" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                                 data-slot="icon">
                                <path fillRule="evenodd"
                                      d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                                      clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">{t.navigation.home}</span>
                        </Link>
                    </div>
                </li>
                {breadcrumbs.map((crumb, i) => (
                    <li key={`${crumb.path}-${i}`} className="flex">
                        <div className="flex items-center">
                            <svg className="h-full w-6 shrink-0 text-gray-200 dark:text-gray-500" viewBox="0 0 24 44"
                                 preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"/>
                            </svg>
                            <a href={i !== breadcrumbs.length - 1 ? crumb.path : "#"}
                               className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                {crumb.title}
                            </a>
                        </div>
                    </li>
                ))}
                <li className="flex">
                    <div className="flex items-center">
                        <svg className="h-full w-6 shrink-0 text-gray-200 dark:text-gray-500" viewBox="0 0 24 44"
                             preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"/>
                        </svg>
                    </div>
                </li>
                <li className="relative flex text-md font-semibold italic text-gray-400 items-center ml-auto">
                    <span>
                        {inGameDate}
                    </span>
                </li>
            </ol>
        </nav>
    );
}