import { NextRequest, NextResponse } from "next/server";
import { fetchAllPositions } from "@/lib/_organizations";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const result = await fetchAllPositions();
        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}