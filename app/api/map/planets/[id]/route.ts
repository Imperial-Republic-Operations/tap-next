import { NextRequest, NextResponse } from "next/server";
import { updatePlanet } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * PUT /api/map/planets/[id]
 * Updates a planet (admin only)
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
        const planetId = BigInt(id);
        const data = await request.json();

        const planet = await updatePlanet(planetId, {
            name: data.name,
            x: data.x,
            y: data.y,
            radius: data.radius,
            color: data.color,
            habitable: data.habitable,
            forceProbabilityModifier: data.forceProbabilityModifier
        });

        return new Response(safeStringify(planet), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating planet:', error);
        return NextResponse.json({ error: 'Failed to update planet' }, { status: 500 });
    }
}