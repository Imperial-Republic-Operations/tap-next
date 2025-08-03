import { NextRequest, NextResponse } from "next/server";
import { fetchSystemWithPlanets, updateSystem } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/systems/[id]
 * Returns a specific system with its planets
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const systemId = BigInt(id);
        
        const system = await fetchSystemWithPlanets(systemId);
        
        if (!system) {
            return NextResponse.json({ error: 'System not found' }, { status: 404 });
        }
        
        return new Response(safeStringify(system), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching system:', error);
        return NextResponse.json({ error: 'Failed to fetch system' }, { status: 500 });
    }
}

/**
 * PUT /api/map/systems/[id]
 * Updates a system (admin only)
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
        const systemId = BigInt(id);
        const data = await request.json();

        const system = await updateSystem(systemId, {
            name: data.name,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            color: data.color
        });

        return new Response(safeStringify(system), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating system:', error);
        return NextResponse.json({ error: 'Failed to update system' }, { status: 500 });
    }
}