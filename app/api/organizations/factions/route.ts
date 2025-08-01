import { NextRequest, NextResponse } from "next/server";
import { fetchFactions } from "@/lib/_organizations";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '0');

        const result = await fetchFactions(page);
        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}