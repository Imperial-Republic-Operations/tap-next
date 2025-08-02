import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { fetchSecurityClearances, createSecurityClearance } from '@/lib/_organizations';
import { safeStringify } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clearances = await fetchSecurityClearances();
        return new NextResponse(safeStringify(clearances), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching security clearances:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, tier } = await request.json();

        if (!name || tier === undefined) {
            return NextResponse.json({ error: 'Name and tier are required' }, { status: 400 });
        }

        const clearances = await createSecurityClearance(name, tier);
        return new NextResponse(safeStringify(clearances), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating security clearance:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}