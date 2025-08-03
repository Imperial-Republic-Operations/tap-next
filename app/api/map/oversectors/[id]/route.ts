import { NextRequest, NextResponse } from "next/server";
import { fetchOversectorWithSectors, updateOversector } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/oversectors/[id]
 * Returns a specific oversector with its sectors
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const oversectorId = BigInt(id);
        
        const oversector = await fetchOversectorWithSectors(oversectorId);
        
        if (!oversector) {
            return NextResponse.json({ error: 'Oversector not found' }, { status: 404 });
        }
        
        return new Response(safeStringify(oversector), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching oversector:', error);
        return NextResponse.json({ error: 'Failed to fetch oversector' }, { status: 500 });
    }
}

/**
 * PUT /api/map/oversectors/[id]
 * Updates an oversector (admin only)
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const { id } = await params;
        const oversectorId = BigInt(id);
        const data = await request.json();

        const oversector = await updateOversector(oversectorId, {
            name: data.name,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            color: data.color
        });

        return new Response(safeStringify(oversector), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating oversector:', error);
        return NextResponse.json({ error: 'Failed to update oversector' }, { status: 500 });
    }
}