import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userHasAccess, roles } from "@/lib/roles";
import { claimNPC } from "@/lib/_characters";
import { safeStringify } from "@/lib/api";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { session } = await getSession();
        
        // Only staff and above can claim NPCs
        if (!userHasAccess(roles[2], session?.user)) { // STAFF level
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id: characterIdStr } = await params;
        const characterId = BigInt(characterIdStr);
        const userId = session!.user!.id!;

        const result = await claimNPC(characterId, userId);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}