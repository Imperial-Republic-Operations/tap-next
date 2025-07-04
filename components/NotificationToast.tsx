'use client'

import { useEffect, useRef, useState } from 'react'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { Notification } from "@/lib/generated/prisma";

interface NotificationProps {
    notification: Notification;
    onAutoDismiss: () => void;
    onInteract: () => void;
    timeout?: number;
}

export default function NotificationToast({notification, onAutoDismiss, onInteract, timeout = 5000}: NotificationProps) {
    const [show, setShow] = useState(true);
    const timerRef = useRef<NodeJS.Timeout>(null);
    const hoverRef = useRef(false);

    /*useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onAutoDismiss();
        }, timeout);

        return () => clearTimeout(timer);
    }, [timeout, onAutoDismiss]);*/

    useEffect(() => {
        if (!hoverRef.current) {
            timerRef.current = setTimeout(() => {
                setShow(false);
                onAutoDismiss();
            }, timeout);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [timeout, onAutoDismiss]);

    const pauseTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        hoverRef.current = true;
    };

    const resumeTimer = () => {
        hoverRef.current = false;
        timerRef.current = setTimeout(() => {
            setShow(false);
            onAutoDismiss();
        }, timeout);
    };

    const handleClose = () => {
        setShow(false);
        onInteract();
    };

    const hasLink = !!notification.link;

    return (
        <div onMouseEnter={pauseTimer} onMouseLeave={resumeTimer} className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Transition show={show}>
                <div className={`pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition`}>
                    <div className="w-0 flex-1 p-4">
                        <div className="flex items-start">
                            <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                            </div>
                        </div>
                    </div>

                    {hasLink ? (
                        <div className="flex flex-col divide-y divide-gray-200 border-l border-gray-200">
                            <div className="flex h-0 flex-1">
                                <Link
                                    href={notification.link!}
                                    onClick={handleClose}
                                    className="flex w-full items-center justify-center rounded-none rounded-tr-lg px-4 py-3 text-sm font-medium text-primary-600 hover:text-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="flex h-0 flex-1">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex w-full items-center justify-center rounded-none rounded-br-lg px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-500 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex border-l border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex w-full items-center justify-center rounded-none rounded-r-lg p-4 text-sm font-medium text-primary-600 hover:text-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}
                </div>
            </Transition>
        </div>
    )
}