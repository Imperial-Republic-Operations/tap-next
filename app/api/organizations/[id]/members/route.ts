import { NextRequest, NextResponse } from "next/server";
import { fetchOrganizationMembers } from "@/lib/_organizations";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '0');
        const search = searchParams.get('search') || undefined;
        const filterType = searchParams.get('filterType') as 'all' | 'leadership' | 'high command' | 'officers' | 'enlisted' | 'civilian' || 'all';
        const sortBy = searchParams.get('sortBy') as 'name' | 'rank' | 'position' | 'joined' || undefined;

        const orgId = BigInt(id);
        
        const filters = {
            search,
            filterType,
            sortBy
        };

        const result = await fetchOrganizationMembers(orgId, page, filters);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}