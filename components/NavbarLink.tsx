'use client'

import { usePathname } from "next/navigation";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

function isCurrentPage(pathname: string, route: string, exact: boolean) {
    if (exact) {
        return pathname === route;
    }
    return pathname.startsWith(route);
}

export default function NavbarLink({href, exact, children}: {href: string, exact: boolean, children: React.ReactNode}) {
    const pathname = usePathname();

    return(
        <a href={href} aria-current={isCurrentPage(pathname, href, exact) ? 'page' : undefined} className={classNames(isCurrentPage(pathname, href, exact) ? 'border-primary-500 text-gray-900 dark:bg-gray-900 dark:text-white' : 'border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white dark:hover:bg-gray-700', 'text-sm font-medium px-3 py-2 border-b-2 text-gray-500 dark:rounded-md dark:text-gray-300 dark:border-none')}>
            {children}
        </a>
    );
}