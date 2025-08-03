import { NextRequest, NextResponse } from "next/server";
import { fetchOversectors, createOversector } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/oversectors
 * Returns all oversectors (without nested data)
 */
export async function GET() {
    try {
        const oversectors = await fetchOversectors();
        
        return new Response(safeStringify(oversectors), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching oversectors:', error);
        return NextResponse.json({ error: 'Failed to fetch oversectors' }, { status: 500 });
    }
}

/**
 * POST /api/map/oversectors
 * Creates a new oversector (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user has admin privileges
        const userRole = session.user.role;
        if (!['SYSTEM_ADMIN', 'ADMIN', 'ASSISTANT_ADMIN'].includes(userRole)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const data = await request.json();
        
        // Validate required fields
        if (!data.name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const oversector = await createOversector({
            name: data.name,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            color: data.color
        });

        return new Response(safeStringify(oversector), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating oversector:', error);
        return NextResponse.json({ error: 'Failed to create oversector' }, { status: 500 });
    }
}