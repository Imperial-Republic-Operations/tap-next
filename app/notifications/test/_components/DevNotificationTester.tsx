'use client'

import { useNotificationQueue } from "@/components/NotificationProvider";
import { createNotification } from "@/lib/_notifications";

interface DevNotificationTesterProps {
    userId: string;
}

export default function DevNotificationTester({ userId }: DevNotificationTesterProps) {
    const { pushNotification } = useNotificationQueue();

    const handleSendTestNotification = async (link: boolean) => {
        const message = '🚀 This is a test notification.';
        const notif = await createNotification(userId, message, link ? '/notifications/test' : undefined);
        pushNotification(notif);
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={() => handleSendTestNotification(false)}
                className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
            >
                Send Test Notification
            </button>
            <button
                onClick={() => handleSendTestNotification(true)}
                className="rounded bg-primary-600 px-4 py-2 text-white hover:bg-primary-500"
            >
                Send Test Notification (with link)
            </button>
        </div>
    )
}