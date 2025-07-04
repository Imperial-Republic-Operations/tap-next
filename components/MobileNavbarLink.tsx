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

export default function MobileNavbarLink({href, exact, children}: {href: string, exact: boolean, children: React.ReactNode}) {
    return(
        <DisclosureButton as="a" href={href} className={classNames(isCurrentPage(href, exact) ? ' border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-900 dark:text-white' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white', 'block px-3 py-2 text-base font-medium border-l-4 text-gray-500 dark:rounded-md dark:text-gray-300 dark:border-none')}>
            {children}
        </DisclosureButton>
    );
}