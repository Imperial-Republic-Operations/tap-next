import { NextRequest, NextResponse } from "next/server";
import { markNotificationAsSeen, markNotificationAsRead, deleteNotification } from "@/lib/_notifications";
import { safeStringify } from "@/lib/api";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action } = body;
        const notificationId = BigInt(id);

        switch (action) {
            case 'mark-seen':
                const seenResult = await markNotificationAsSeen(notificationId);
                return new Response(safeStringify(seenResult), { headers: { 'Content-Type': 'application/json' } });

            case 'mark-read':
                const readResult = await markNotificationAsRead(notificationId);
                return new Response(safeStringify(readResult), { headers: { 'Content-Type': 'application/json' } });

            case 'delete':
                const deleteResult = await deleteNotification(notificationId);
                return new Response(safeStringify(deleteResult), { headers: { 'Content-Type': 'application/json' } });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}