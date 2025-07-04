'use client'

import { Notification } from "@/lib/generated/prisma";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUnseenNotifications, markNotificationAsRead, markNotificationAsSeen } from "@/lib/_notifications";
import NotificationToast from "@/components/NotificationToast";

const MAX_VISIBLE = 2;
const AUTO_DISMISS = 5000;
const POLLING_INTERVAL = 10000;

type NotificationContextType = {
    pushNotification: (notification: Notification) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationQueue() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotificationQueue must be used within NotificationProvider');
    return context;
}

export function NotificationProvider({children, userId}: {children: React.ReactNode, userId: string | undefined, }) {
    const [queue, setQueue] = useState<Notification[]>([]);
    const [visible, setVisible] = useState<Notification[]>([]);
    const [seenIds, setSeenIds] = useState<Set<bigint>>(new Set());

    useEffect(() => {
        if (!userId) return;

        const fetchAndInject = async () => {
            try {
                const unseen = await fetchUnseenNotifications(userId);

                const newOnes = unseen.filter((n) => !seenIds.has(n.id));

                if (newOnes.length > 0) {
                    newOnes.forEach((n) => {
                        pushNotification(n);
                        setSeenIds((prev) => new Set(prev).add(n.id));
                    });
                }
            } catch (e) {
                console.error('Failed to fetch unseen notifications.', e);
            }
        };

        fetchAndInject();
        const interval = setInterval(fetchAndInject, POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, [userId, seenIds]);

    useEffect(() => {
        if (queue.length > 0 && visible.length < MAX_VISIBLE) {
            const next = queue[0];
            setVisible((prev) => [...prev, next]);
            setQueue((prev) => prev.slice(1))
        }
    }, [queue, visible]);

    const removeNotification = async (id: bigint, markRead: boolean = false) => {
        setVisible((prev) => prev.filter((n) => n.id !== id))
        await markNotificationAsSeen(id);
        if (markRead) await markNotificationAsRead(id);
    }

    const pushNotification = (notification: Notification) => {
        setQueue((prev) => [...prev, notification]);
    }

    return (
        <NotificationContext.Provider value={{ pushNotification }}>
            {children}
            <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex flex-col items-end space-y-4 px-4 py-6 sm:items-start sm:p-6 z-999">
                {visible.map((n) => (
                    <NotificationToast key={n.id} notification={n} onAutoDismiss={() => removeNotification(n.id, false)} onInteract={() => removeNotification(n.id, true)} timeout={AUTO_DISMISS} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
}
