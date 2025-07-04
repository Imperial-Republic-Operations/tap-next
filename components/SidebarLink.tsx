'use client'

import { usePathname } from "next/navigation";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

function isCurrentPage(route: string, exact: boolean) {
    const pathname = usePathname();

    if (exact) {
        return pathname === route;
    }
    return pathname.startsWith(route);
}

export default function SidebarLink({title, href, exact, badge}: {title: string, href: string, exact: boolean, badge?: number}) {
    return(
        <li>
            <a href={href} aria-current={isCurrentPage(href, exact) ? 'page' : undefined} className={classNames(isCurrentPage(href, exact) ? 'bg-gray-100 text-primary-600 dark:bg-gray-800 dark:text-white' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold')}>
                {title}
                {typeof badge !== 'undefined' && (
                    <span aria-hidden="true" className={classNames(badge > 0 ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20', 'ml-auto w-9 min-w-max rounded-full px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap ring-1 ring-inset')}>
                        {badge > 10 ? '10+' : badge}
                    </span>
                )}
            </a>
        </li>
    );
}