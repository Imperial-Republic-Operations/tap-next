'use client'

import { getBreadcrumbTitle, getBreadcrumbTitleByType } from "@/lib/title";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsNotFound } from "@/contexts/NotFoundContext";
import Link from "next/link";
import { useAppTime } from "@/hooks/useAppTime";
import { useFormatting } from '@/hooks/useFormatting';

function isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
}

function isType(base: string, value: string): boolean {
    const types: { [key: string]: string[] } = {
        "documents": ["game", "organization", "personal"],
    };
    return types[base] ? types[base].includes(value.toLowerCase()) : false;
}

function isKeyword(value: string): boolean {
    const keywords = ["edit", "view"];
    return keywords.includes(value.toLowerCase());
}

function getPathPrefix(keyword: string, t: any): string {
    switch (keyword.toLowerCase()) {
        case "edit":
            return t.breadcrumb.editing;
        case "view":
            return t.breadcrumb.viewing;
        default:
            return "";
    }
}

function titleCase(str: string): string {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

interface StaticDateInfo {
    gameMonth: string;
    gameYear: number;
    era: string;
    day: number;
}

// export default function Breadcrumb({ inGameDate }: { inGameDate: string }) {
export default function Breadcrumb({ staticDateInfo }: { staticDateInfo: StaticDateInfo }) {
    const pathname = usePathname();
    const isNotFoundPage = useIsNotFound();
    const { getAppTime } = useAppTime();
    const { formatTimeSeconds, t } = useFormatting();

    const [pages, setPages] = useState<{ name: string, path: string }[]>([]);
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
        const generatePages = async () => {
            const segments = pathname.substring(1).split('/');
            const pagesList: {name: string, path: string}[] = [];
            let path = "";

            if (pathname === '/') return;

            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                path += `/${segment}`;

                if (isKeyword(segment)) {
                    const keyword = segment;
                    const base = segments[0]?.toLowerCase();
                    const prefix = getPathPrefix(keyword, t);

                    if (i +2 < segments.length && isType(base, segments[i + 1]) && isNumeric(segments[i + 2])) {
                        const type = segments[i + 1];
                        const id = BigInt(segments[i + 2]);
                        path += `/${type}/${id}`;

                        const title = await getBreadcrumbTitleByType(base, type, id);
                        pagesList.push({name: prefix ? `${prefix} ${title}` : title, path})
                        i += 2;
                    } else if (i + 1 < segments.length && isNumeric(segments[i + 1])) {
                        const id = BigInt(segments[i + 1]);
                        path += `/${id}`;

                        const title = await getBreadcrumbTitle(base, id);
                        pagesList.push({name: prefix ? `${prefix} ${title}` : title, path})
                        i++;
                    }
                } else if (isNumeric(segment)) {
                    const base = segments[i - 1] ? segments[i - 1].toLowerCase() : "";
                    const title = await getBreadcrumbTitle(base, BigInt(segment));
                    pagesList.push({name: title, path})
                } else if (segment === "new") {
                    let name = t.breadcrumb.creating;
                    switch (segments[i - 1]) {
                        case "characters":
                            name += ` ${t.breadcrumb.character}`;
                            break;
                        case "organizations":
                            name += ` ${t.breadcrumb.organization}`;
                            break;
                        default:
                            name += "...";
                    }
                    pagesList.push({name: titleCase(name), path})
                } else if (segment === "pending") {
                    pagesList.push({name: titleCase(`${t.breadcrumb.pending} ${segments[i - 1]}`), path})
                } else {
                    pagesList.push({ name: titleCase(segment.replaceAll("-", " ")), path });
                }
            }

            setPages(pagesList);
        };

        generatePages();
    }, [pathname, isNotFoundPage]);

    useEffect(() => {
        const currentPageIndex = pages.length - 1;
        const title = currentPageIndex >= 0 ? pages[currentPageIndex].name : "Home";
        document.title = `${title} | Terminal Access Project`
    }, [pages]);

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
                {pages.map((page, i) => (
                    <li key={page.name} className="flex">
                        <div className="flex items-center">
                            <svg className="h-full w-6 shrink-0 text-gray-200 dark:text-gray-500" viewBox="0 0 24 44"
                                 preserveAspectRatio="none" fill="currentColor" aria-hidden="true">
                                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z"/>
                            </svg>
                            <a href={i !== pages.length - 1 ? page.path : "#"}
                               className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                {page.name}
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