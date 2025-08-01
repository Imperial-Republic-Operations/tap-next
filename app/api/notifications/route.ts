import { NextRequest, NextResponse } from "next/server";
import { 
    createNotification, 
    fetchUnseenNotifications, 
    fetchUnreadNotificationCount,
    fetchUndeletedNotifications,
    fetchUsersNotifications,
    fetchAllNotifications,
    markUserNotificationsAsRead
} from "@/lib/_notifications";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page') || '0');

        switch (type) {
            case 'unseen':
                if (!userId) {
                    return NextResponse.json({ error: 'userId is required for unseen notifications' }, { status: 400 });
                }
                const unseenResult = await fetchUnseenNotifications(userId);
                return new Response(safeStringify(unseenResult), { headers: { 'Content-Type': 'application/json' } });

            case 'unread-count':
                if (!userId) {
                    return NextResponse.json({ error: 'userId is required for unread count' }, { status: 400 });
                }
                const countResult = await fetchUnreadNotificationCount(userId);
                return new Response(safeStringify({ count: countResult }), { headers: { 'Content-Type': 'application/json' } });

            case 'undeleted':
                if (!userId) {
                    return NextResponse.json({ error: 'userId is required for undeleted notifications' }, { status: 400 });
                }
                const undeletedResult = await fetchUndeletedNotifications(userId, page);
                return new Response(safeStringify(undeletedResult), { headers: { 'Content-Type': 'application/json' } });

            case 'user':
                if (!userId) {
                    return NextResponse.json({ error: 'userId is required for user notifications' }, { status: 400 });
                }
                const userResult = await fetchUsersNotifications(userId, page);
                return new Response(safeStringify(userResult), { headers: { 'Content-Type': 'application/json' } });

            case 'all':
                const allResult = await fetchAllNotifications(page);
                return new Response(safeStringify(allResult), { headers: { 'Content-Type': 'application/json' } });

            default:
                return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, message, link } = body;

        if (!userId || !message) {
            return NextResponse.json({ error: 'userId and message are required' }, { status: 400 });
        }

        const result = await createNotification(userId, message, link);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, action } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        if (action === 'mark-all-read') {
            const result = await markUserNotificationsAsRead(userId);
            return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}