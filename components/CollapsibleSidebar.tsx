'use client'

import { useEffect, useState } from "react";
import { Team } from "@/lib/generated/prisma";
import { classNames } from "@/lib/style";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { userHasAccess } from "@/lib/roles";
import { Session } from "next-auth";
import { fetchUser, UserWithTeamAndTeams } from "@/lib/_users";

export default function CollapsibleSidebar({navigation, session, status}: {navigation: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[], session: Session | null, status: 'authenticated' | 'unauthenticated'}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [scrollY, setScrollY] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    const loadUserData = async () => {
        if (session?.user) {
            const user: UserWithTeamAndTeams | null = await fetchUser(session.user.id);

            if (user?.team) {
                const userTeams = [user.team];
                user.teams.filter((team: Team) => team.id !== user.team?.id).forEach((team: Team) => userTeams.push(team));
                setTeams(userTeams);
            } else {
                setTeams(user?.teams ?? []);
            }
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const measureHeaderHeight = () => {
            const navElement = document.querySelector('nav#header-wrapper') as HTMLElement;
            if (navElement) {
                setHeaderHeight(navElement.offsetHeight);
            }
        };

        measureHeaderHeight();

        window.addEventListener('resize', measureHeaderHeight);

        const navElement = document.querySelector('nav#header-wrapper') as HTMLElement;
        if (navElement) {
            const resizeObserver = new ResizeObserver(measureHeaderHeight);
            resizeObserver.observe(navElement);

            return () => {
                window.removeEventListener('resize', measureHeaderHeight);
                resizeObserver.disconnect();
            };
        }

        return () => {
            window.removeEventListener('resize', measureHeaderHeight);
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isCollapsed]);

    const getTopOffset = () => {
        return Math.max(0, headerHeight - scrollY);
    };

    return(
        <>
            <div className={classNames(isCollapsed ? 'w-16' : 'w-72', 'flex flex-col h-screen fixed overflow-y-auto')} style={{top: `${getTopOffset()}px`, height: `calc(100vh - ${getTopOffset()}px)`, transition: 'width 300ms ease-in-out'}}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        <span className={classNames(isCollapsed ? 'opacity-0 hidden' : 'opacity-100', 'font-semibold text-gray-900 dark:text-white transition-opacity duration-200 ease-in-out')}>
                            Navigation
                        </span>
                        <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}>
                            {isCollapsed ? (
                                <ChevronRightIcon className="h-5 w-5" />
                            ) : (
                                <ChevronLeftIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navigation
                                        .filter((item) => !item.signInRequired || (item.signInRequired && status === "authenticated" && userHasAccess(item.role ? item.role : null, session?.user)))
                                        .map((link) => (
                                            <li key={link.title}>
                                                <a
                                                    href={link.path}
                                                    className={classNames(
                                                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                                        "text-gray-700 hover:text-primary-600 hover:bg-gray-100",
                                                        "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                                                        isCollapsed && "justify-center"
                                                    )}
                                                    title={isCollapsed ? link.title : undefined}
                                                >
                                                    {/* Icon placeholder - you can add specific icons here */}
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-primary-600 group-hover:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:group-hover:text-white">
                                                        {link.title.substring(0, 1)}
                                                    </span>

                                                    {!isCollapsed && (
                                                        <>
                                                            <span className="truncate">{link.title}</span>
                                                            {typeof link.badge !== 'undefined' && (
                                                                <span className={classNames(
                                                                    link.badge > 0 ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20' :
                                                                        'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20',
                                                                    'ml-auto w-9 min-w-max rounded-full px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap ring-1 ring-inset'
                                                                )}>
                                                                    {link.badge > 10 ? '10+' : link.badge}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </li>

                            {teams.length > 0 && !isCollapsed && (
                                <li>
                                    <div className="text-xs/6 font-semibold text-gray-400">Your teams</div>
                                    <ul className="-mx-2 mt-2 space-y-1">
                                        {teams.map((team) => (
                                            <li key={team.id}>
                                                <a href="#" className="group relative flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
                                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:border-primary-600 dark:group-hover:border-gray-700 group-hover:text-primary-600 dark:group-hover:text-white">
                                                        {team.abbreviation.substring(0, 1)}
                                                    </span>
                                                    <span className="truncate">{team.abbreviation}</span>
                                                    <div className="tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded py-1 px-2">
                                                        {team.name}
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>

            <style jsx global>{`
                .sidebar-content {
                    margin-left: ${isCollapsed ? '-14rem' : '0rem'};
                    transition: margin-left 0.3s ease-in-out;
                }
            `}</style>
        </>
    );
}