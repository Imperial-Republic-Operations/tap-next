'use client'

import { useRouter } from "next/navigation";
import { BellIcon } from "@heroicons/react/24/outline";

interface NotificationBellProps {
    loggedIn: boolean;
    hasNotifications: boolean;
}

export default function NotificationBell({loggedIn, hasNotifications}: NotificationBellProps) {
    const router = useRouter();

    const handleClick = () => {
        if (loggedIn) {
            router.push("/notifications");
        }
    }

    return (
        <button onClick={handleClick} type="button" className="relative rounded-full p-1 text-gray-400 focus:ring-2 focus:ring-offset-2 focus:outline-hidden bg-white hover:text-gray-500 focus:ring-primary-500 dark:bg-gray-800 dark:hover:text-white dark:focus:ring-white dark:focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="size-6" />
            {hasNotifications && (<span className="animate-ping absolute top-1 right-0.5 block h-1 w-1 rounded-full ring-2 ring-red-400 bg-red-600"></span>)}
        </button>
    );
}