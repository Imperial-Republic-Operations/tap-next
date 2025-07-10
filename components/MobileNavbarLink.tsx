'use client'

import { usePathname } from "next/navigation";
import { DisclosureButton } from "@headlessui/react";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

function isCurrentPage(pathname: string, route: string, exact: boolean) {
    if (exact) {
        return pathname === route;
    }
    return pathname.startsWith(route);
}

export default function MobileNavbarLink({href, exact, children}: {href: string, exact: boolean, children: React.ReactNode}) {
    const pathname = usePathname();

    return(
        <DisclosureButton as="a" href={href} className={classNames(isCurrentPage(pathname, href, exact) ? ' border-primary-500 bg-primary-50 text-primary-700 dark:bg-gray-900 dark:text-white' : 'border-transparent hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white', 'block px-3 py-2 text-base font-medium border-l-4 text-gray-500 dark:rounded-md dark:text-gray-300 dark:border-none')}>
            {children}
        </DisclosureButton>
    );
}