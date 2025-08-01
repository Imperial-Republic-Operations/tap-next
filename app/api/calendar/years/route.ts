import { NextRequest, NextResponse } from "next/server";
import { createYear, fetchYears, fetchCurrentYear, makeYearCurrent } from "@/lib/_calendar";
import { Era } from "@/lib/generated/prisma";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '0');
        const era = searchParams.get('era') as Era | undefined;
        const current = searchParams.get('current') === 'true';

        if (current) {
            const currentYear = await fetchCurrentYear();
            return new Response(safeStringify(currentYear), { headers: { 'Content-Type': 'application/json' } });
        }

        const result = await fetchYears(page, era);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { gameYear, era, current } = body;

        if (!gameYear || !era) {
            return NextResponse.json({ error: 'gameYear and era are required' }, { status: 400 });
        }

        const result = await createYear({ gameYear, era, current: !!current });
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }

        const result = await makeYearCurrent(BigInt(id));
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}