import { NextRequest, NextResponse } from "next/server";
import { createPlanet, fetchPlanetsForSystem } from "@/lib/_map";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

/**
 * GET /api/map/planets?systemId=123
 * Returns planets for a specific system
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const systemId = searchParams.get('systemId');
        
        if (!systemId) {
            return NextResponse.json({ error: 'systemId parameter is required' }, { status: 400 });
        }
        
        const planets = await fetchPlanetsForSystem(BigInt(systemId));
        
        return new Response(safeStringify(planets), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching planets:', error);
        return NextResponse.json({ error: 'Failed to fetch planets' }, { status: 500 });
    }
}

/**
 * POST /api/map/planets
 * Creates a new planet (admin only)
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
        if (!data.name || !data.systemId) {
            return NextResponse.json({ error: 'Name and systemId are required' }, { status: 400 });
        }

        const planet = await createPlanet({
            name: data.name,
            systemId: BigInt(data.systemId),
            x: data.x,
            y: data.y,
            radius: data.radius,
            color: data.color,
            habitable: data.habitable,
            forceProbabilityModifier: data.forceProbabilityModifier
        });

        return new Response(safeStringify(planet), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating planet:', error);
        return NextResponse.json({ error: 'Failed to create planet' }, { status: 500 });
    }
}