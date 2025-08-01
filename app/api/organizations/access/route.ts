import { NextRequest, NextResponse } from "next/server";
import { getCharacterOrganizationAccess, getSubOrganizations, fetchUniqueCharacterCount } from "@/lib/_organizations";
import { safeStringify } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const charId = searchParams.get('charId');
        const parentOrgId = searchParams.get('parentOrgId');
        const type = searchParams.get('type');

        if (type === 'character-access') {
            if (!charId) {
                return NextResponse.json({ error: 'charId is required for character access' }, { status: 400 });
            }
            const result = await getCharacterOrganizationAccess(BigInt(charId));
            return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }

        if (type === 'sub-organizations') {
            if (!parentOrgId) {
                return NextResponse.json({ error: 'parentOrgId is required for sub-organizations' }, { status: 400 });
            }
            const result = await getSubOrganizations(BigInt(parentOrgId));
            return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }

        if (type === 'unique-character-count') {
            if (!parentOrgId) {
                return NextResponse.json({ error: 'parentOrgId is required for unique character count' }, { status: 400 });
            }
            const result = await fetchUniqueCharacterCount(BigInt(parentOrgId));
            return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }

        if (type === 'sister-organizations') {
            if (!parentOrgId) {
                return NextResponse.json({ error: 'parentOrgId is required for sister organizations' }, { status: 400 });
            }
            const orgId = searchParams.get('orgId');
            if (!orgId) {
                return NextResponse.json({ error: 'orgId is required for sister organizations' }, { status: 400 });
            }

            const sisterOrgs = await prisma.organization.findMany({
                where: {
                    parentId: BigInt(parentOrgId),
                    id: { not: BigInt(orgId) }
                },
                select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                },
                orderBy: { name: 'asc' },
                take: 10,
            });

            return new Response(safeStringify(sisterOrgs), { headers: { 'Content-Type': 'application/json' } });
        }

        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}