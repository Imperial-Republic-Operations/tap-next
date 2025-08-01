import { NextRequest, NextResponse } from "next/server";
import { fetchCharacters } from "@/lib/_characters";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const tab = searchParams.get('tab') as 'personal' | 'npc' || 'personal';
        const page = parseInt(searchParams.get('page') || '0');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const result = await fetchCharacters(userId, tab, page);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}