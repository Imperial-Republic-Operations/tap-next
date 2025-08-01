import { NextRequest, NextResponse } from "next/server";
import { fetchDocument } from "@/lib/_documents";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string, id: string }> }) {
    try {
        const { type, id } = await params;

        if (!['game', 'organization', 'personal'].includes(type)) {
            return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
        }

        const result = await fetchDocument(type as 'game' | 'organization' | 'personal', BigInt(id));
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}