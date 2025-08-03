import { NextResponse } from "next/server";
import { fetchGalaxyMapData } from "@/lib/_map";
import { safeStringify } from "@/lib/api";

/**
 * GET /api/map/galaxy
 * Returns the complete galaxy map data with all nested relationships
 * This is optimized for the interactive map visualization
 */
export async function GET() {
    try {
        const galaxyData = await fetchGalaxyMapData();
        
        return new Response(safeStringify(galaxyData), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching galaxy map data:', error);
        return NextResponse.json({ error: 'Failed to fetch galaxy map data' }, { status: 500 });
    }
}