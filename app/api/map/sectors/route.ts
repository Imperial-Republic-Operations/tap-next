import { NextRequest, NextResponse } from "next/server";
import { createSector, fetchSectorsForOversector } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/sectors?oversectorId=123
 * Returns sectors for a specific oversector
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const oversectorId = searchParams.get('oversectorId');
        
        if (!oversectorId) {
            return NextResponse.json({ error: 'oversectorId parameter is required' }, { status: 400 });
        }
        
        const sectors = await fetchSectorsForOversector(BigInt(oversectorId));
        
        return new Response(safeStringify(sectors), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching sectors:', error);
        return NextResponse.json({ error: 'Failed to fetch sectors' }, { status: 500 });
    }
}

/**
 * POST /api/map/sectors
 * Creates a new sector (admin only)
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
        if (!data.name || !data.oversectorId) {
            return NextResponse.json({ error: 'Name and oversectorId are required' }, { status: 400 });
        }

        const sector = await createSector({
            name: data.name,
            oversectorId: BigInt(data.oversectorId),
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            color: data.color
        });

        return new Response(safeStringify(sector), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating sector:', error);
        return NextResponse.json({ error: 'Failed to create sector' }, { status: 500 });
    }
}