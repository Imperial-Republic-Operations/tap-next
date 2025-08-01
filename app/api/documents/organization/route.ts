import { NextRequest, NextResponse } from "next/server";
import { fetchOrganizationDocuments } from "@/lib/_documents";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const charId = searchParams.get('charId');
        const orgId = searchParams.get('orgId');
        const page = parseInt(searchParams.get('page') || '0');

        if (!charId) {
            return NextResponse.json({ error: 'charId is required' }, { status: 400 });
        }

        const result = await fetchOrganizationDocuments(
            BigInt(charId),
            orgId ? BigInt(orgId) : null,
            page
        );
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}