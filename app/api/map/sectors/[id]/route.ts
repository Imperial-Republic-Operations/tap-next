import { NextRequest, NextResponse } from "next/server";
import { fetchSectorWithSystems, updateSector } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/sectors/[id]
 * Returns a specific sector with its systems
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const sectorId = BigInt(id);
        
        const sector = await fetchSectorWithSystems(sectorId);
        
        if (!sector) {
            return NextResponse.json({ error: 'Sector not found' }, { status: 404 });
        }
        
        return new Response(safeStringify(sector), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching sector:', error);
        return NextResponse.json({ error: 'Failed to fetch sector' }, { status: 500 });
    }
}

/**
 * PUT /api/map/sectors/[id]
 * Updates a sector (admin only)
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
        const sectorId = BigInt(id);
        const data = await request.json();

        const sector = await updateSector(sectorId, {
            name: data.name,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            color: data.color
        });

        return new Response(safeStringify(sector), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating sector:', error);
        return NextResponse.json({ error: 'Failed to update sector' }, { status: 500 });
    }
}