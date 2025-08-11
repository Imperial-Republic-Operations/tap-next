import { NextRequest, NextResponse } from "next/server";
import { fetchAllTeams } from "@/lib/_users";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const result = await fetchAllTeams();
        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}