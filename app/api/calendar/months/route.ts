import { NextRequest, NextResponse } from "next/server";
import { fetchMonths, fetchMonth, updateMonth } from "@/lib/_calendar";
import { RealMonth } from "@/lib/generated/prisma";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const month = searchParams.get('month');

        if (month) {
            const result = await fetchMonth(month);
            return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
        }

        const result = await fetchMonths();
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { realMonth, gameMonth } = body;

        if (!realMonth || !gameMonth) {
            return NextResponse.json({ error: 'realMonth and gameMonth are required' }, { status: 400 });
        }

        const result = await updateMonth(realMonth as RealMonth, gameMonth);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}