import { NextRequest, NextResponse } from "next/server";
import { createSystem, fetchSystemsForSector } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/systems?sectorId=123
 * Returns systems for a specific sector
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sectorId = searchParams.get('sectorId');
        
        if (!sectorId) {
            return NextResponse.json({ error: 'sectorId parameter is required' }, { status: 400 });
        }
        
        const systems = await fetchSystemsForSector(BigInt(sectorId));
        
        return new Response(safeStringify(systems), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching systems:', error);
        return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 });
    }
}

/**
 * POST /api/map/systems
 * Creates a new system (admin only)
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
        if (!data.name || !data.sectorId) {
            return NextResponse.json({ error: 'Name and sectorId are required' }, { status: 400 });
        }

        const system = await createSystem({
            name: data.name,
            sectorId: BigInt(data.sectorId),
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            color: data.color
        });

        return new Response(safeStringify(system), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating system:', error);
        return NextResponse.json({ error: 'Failed to create system' }, { status: 500 });
    }
}