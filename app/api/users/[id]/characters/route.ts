import { NextRequest, NextResponse } from "next/server";
import { safeStringify } from "@/lib/api";
import { fetchAllUserCharacters } from "@/lib/_characters";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: userId } = await params;
        
        const characters = await fetchAllUserCharacters(userId);

        return new Response(safeStringify(characters), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}