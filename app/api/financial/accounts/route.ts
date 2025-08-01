import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createCreditAccount, fetchInventoryCounts } from '@/lib/_inventory';
import { InventoryType } from '@/lib/generated/prisma';

export async function GET(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const ownerId = url.searchParams.get('ownerId');
        const type = url.searchParams.get('type') as 'CHARACTER' | 'ORGANIZATION';

        if (!ownerId || !type) {
            return NextResponse.json({ error: 'Missing ownerId or type parameter' }, { status: 400 });
        }

        const { creditAccount } = await fetchInventoryCounts(BigInt(ownerId), type as InventoryType);
        return NextResponse.json(creditAccount);
    } catch (error) {
        console.error('Error fetching credit account:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ownerId, type } = body;

        if (!ownerId || !type) {
            return NextResponse.json({ error: 'Missing ownerId or type in request body' }, { status: 400 });
        }

        if (!['CHARACTER', 'ORGANIZATION'].includes(type)) {
            return NextResponse.json({ error: 'Type must be CHARACTER or ORGANIZATION' }, { status: 400 });
        }

        const account = await createCreditAccount(type as InventoryType, BigInt(ownerId));
        return NextResponse.json(account, { status: 201 });
    } catch (error) {
        console.error('Error creating credit account:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}