import { NextRequest, NextResponse } from "next/server";
import { 
    fetchOrganization, 
    fetchOrganizationWithTotalMembers,
    fetchOrganizationParents,
    fetchUniqueCharacterCount,
    fetchOrganizationMemberBreakdown
} from "@/lib/_organizations";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');
        const orgId = BigInt(id);

        switch (type) {
            case 'with-total-members':
                const withTotalResult = await fetchOrganizationWithTotalMembers(orgId);
                return new Response(safeStringify(withTotalResult), { headers: { 'Content-Type': 'application/json' } });

            case 'parents':
                const parentsResult = await fetchOrganizationParents(orgId);
                return new Response(safeStringify(parentsResult), { headers: { 'Content-Type': 'application/json' } });

            case 'unique-count':
                const countResult = await fetchUniqueCharacterCount(orgId);
                return new Response(safeStringify({ count: countResult }), { headers: { 'Content-Type': 'application/json' } });

            case 'member-breakdown':
                const breakdownResult = await fetchOrganizationMemberBreakdown(orgId);
                return new Response(safeStringify(breakdownResult), { headers: { 'Content-Type': 'application/json' } });

            default:
                const result = await fetchOrganization(orgId);
                return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}