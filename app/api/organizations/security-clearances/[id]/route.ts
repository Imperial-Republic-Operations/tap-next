import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateSecurityClearanceTier } from '@/lib/_organizations';
import { safeStringify } from '@/lib/api';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { tier } = await request.json();

        if (tier === undefined) {
            return NextResponse.json({ error: 'Tier is required' }, { status: 400 });
        }

        const { id: idString } = await params;
        const id = BigInt(idString);
        const clearances = await updateSecurityClearanceTier(id, tier);
        return new NextResponse(safeStringify(clearances), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating security clearance tier:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}