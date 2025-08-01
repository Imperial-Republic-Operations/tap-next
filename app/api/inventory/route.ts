import { NextRequest, NextResponse } from "next/server";
import { fetchInventoryCounts } from "@/lib/_inventory";
import { InventoryType } from "@/lib/generated/prisma";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ownerId = searchParams.get('ownerId');
        const type = searchParams.get('type') as InventoryType;

        if (!ownerId || !type) {
            return NextResponse.json({ error: 'ownerId and type are required' }, { status: 400 });
        }

        if (!['CHARACTER', 'ORGANIZATION'].includes(type)) {
            return NextResponse.json({ error: 'Invalid inventory type' }, { status: 400 });
        }

        const result = await fetchInventoryCounts(BigInt(ownerId), type);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}