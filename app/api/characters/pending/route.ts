import { NextRequest, NextResponse } from "next/server";
import { fetchPendingCharacters } from "@/lib/_characters";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '0');
        
        const result = await fetchPendingCharacters(page);
        
        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}