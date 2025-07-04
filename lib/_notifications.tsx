'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

let PAGE_SIZE: number = 20;

export type NotificationWithUser = Prisma.NotificationGetPayload<{
    include: {
        user: true,
    },
}>

export async function createNotification(userId: string, message: string, link?: string) {
    return prisma.notification.create({
        data: {
            userId,
            message,
            link,
        },
    });
}

export async function fetchUnseenNotifications(userId: string) {
    return prisma.notification.findMany({
        where: {
            userId,
            seen: false,
        },
        orderBy: {createdAt: 'asc'},
    });
}

export async function fetchUnreadNotificationCount(userId: string) {
    return prisma.notification.count({
        where: {
            userId,
            read: false,
        },
    });
}

export async function fetchUndeletedNotifications(userId: string, page: number) {
    const skip = page * PAGE_SIZE;

    const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
            where: {
                userId,
                deleted: false,
            },
            skip,
            take: PAGE_SIZE,
            orderBy: {createdAt: 'desc'},
        }),
        prisma.notification.count({
            where: {
                userId,
                deleted: false,
            },
        })
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { notifications, totalPages };
}

export async function fetchUsersNotifications(userId: string, page: number) {
    const skip = page * PAGE_SIZE;

    const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
            where: {
                userId,
            },
            skip,
            take: PAGE_SIZE,
            orderBy: {createdAt: 'desc'},
        }),
        prisma.notification.count({
            where: {
                userId,
            },
        })
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { notifications, totalPages };
}

export async function fetchAllNotifications(page: number) {
    const skip = page * PAGE_SIZE;

    const [notifications, totalCount] = await Promise.all([
        prisma.notification.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {createdAt: 'desc'},
            include: {
                user: true,
            },
        }),
        prisma.notification.count({
        })
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { notifications, totalPages };
}

export async function markNotificationAsSeen(id: bigint) {
    return prisma.notification.update({
        where: { id },
        data: {
            seen: true,
        },
    });
}

export async function markNotificationAsRead(id: bigint) {
    return prisma.notification.update({
        where: { id },
        data: {
            read: true,
        },
    });
}

export async function markUserNotificationsAsRead(userId: string) {
    return prisma.notification.updateMany({
        where: {
            userId,
            read: false,
        },
        data: {
            read: true,
        },
    });
}

export async function deleteNotification(id: bigint) {
    return prisma.notification.update({
        where: { id },
        data: {
            deleted: true,
        },
    });
}
