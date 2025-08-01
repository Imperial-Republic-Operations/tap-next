import { NextRequest, NextResponse } from "next/server";
import { fetchCharacter, fetchCharacterClearance, updateCharacter } from "@/lib/_characters";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const clearanceOnly = searchParams.get('clearanceOnly') === 'true';
        const charId = BigInt(id);

        if (clearanceOnly) {
            const result = await fetchCharacterClearance(charId);
            return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }

        const result = await fetchCharacter(charId);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const charId = BigInt(id);
        const body = await request.json();

        // Convert string IDs back to BigInt
        const data = {
            ...body,
            speciesId: BigInt(body.speciesId),
            homeworldId: BigInt(body.homeworldId),
        };

        const result = await updateCharacter(charId, data);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error updating character:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}