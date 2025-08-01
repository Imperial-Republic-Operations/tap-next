import { NextRequest, NextResponse } from "next/server";
import { fetchUser } from "@/lib/_users";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: userId } = await params;
        const result = await fetchUser(userId);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}