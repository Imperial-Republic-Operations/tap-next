'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { Notification } from "@/lib/generated/prisma";
import {
    deleteNotification,
    fetchUndeletedNotifications,
    markNotificationAsRead,
    markUserNotificationsAsRead
} from "@/lib/_notifications";
import { BellIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/lib/style";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsList({userId}: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState(0);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [markingAllRead, setMarkingAllRead] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);

    const loadNotifications = useCallback(async (pageNum: number) => {
        if (loading) return;

        setLoading(true);
        try {
            const { notifications: newNotifications, totalPages } = await fetchUndeletedNotifications(userId, pageNum);
            // await markUserNotificationsAsRead(userId);

            if (pageNum === 0) {
                setNotifications(newNotifications);
                setFirstLoad(false);
            } else {
                setNotifications((prev) => [...prev, ...newNotifications]);
            }

            setPage(pageNum);
            setHasMore(pageNum < totalPages - 1);
        } catch (e) {
            console.error('Failed to fetch notifications.', e);
        } finally {
            setLoading(false);
        }
    }, [userId, loading]);

    const handleMarkAsRead = async (notification: Notification) => {
        if (notification.read) return;

        try {
            await markNotificationAsRead(notification.id);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
        } catch (e) {
            console.error('Failed to mark notification as read.', e);
        }
    };

    const handleDelete = async (notificationId: bigint) => {
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (e) {
            console.error('Failed to delete notification.', e);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (markingAllRead) return;

        setMarkingAllRead(true);
        try {
            await markUserNotificationsAsRead(userId);
            setNotifications(prev => prev.map(n => ({ ...n, read: true})));
        } catch (e) {
            console.error('Failed to mark all as read.', e);
        } finally {
            setMarkingAllRead(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadNotifications(page + 1);
            }
        }, {
            threshold: 0.1,
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [page, hasMore, loading, loadNotifications]);

    useEffect(() => {
        loadNotifications(0);
    }, []);

    const NotificationSkeleton = () => (
        <div className="animate-pulse p-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );

    if (!firstLoad && !loading && notifications.length === 0) {
        return (
            <div className="text-center py-12">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You&apos;re all caught up!</p>
            </div>
        );
    }

    return (
        <div>
            {/* Mark all as read button */}
            {notifications.some(n => !n.read) && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={markingAllRead}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        {markingAllRead ? 'Marking...' : 'Mark all as read'}
                    </button>
                </div>
            )}

            {/* Notifications list */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                        <li key={notification.id.toString()}>
                            <div
                                className={classNames(
                                    'block hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-4 sm:px-6 transition-colors',
                                    !notification.read && 'bg-blue-50 dark:bg-blue-900/20'
                                )}
                                onClick={() => handleMarkAsRead(notification)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className={classNames(
                                                'h-2 w-2 rounded-full',
                                                notification.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-600 dark:bg-blue-400'
                                            )} />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className={classNames(
                                                    'text-sm',
                                                    notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'
                                                )}>
                                                    {notification.message}
                                                </p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                            {notification.link && (
                                                <div className="mt-1">
                                                    <a
                                                        href={notification.link}
                                                        className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View details →
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(notification.id);
                                            }}
                                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[...Array(5)].map((_, i) => (
                            <NotificationSkeleton key={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* Intersection observer target */}
            {!firstLoad && (
                <div ref={observerTarget} className="h-10" />
            )}

            {/* End of list message */}
            {!hasMore && notifications.length > 0 && (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    No more notifications
                </div>
            )}
        </div>
    );
}