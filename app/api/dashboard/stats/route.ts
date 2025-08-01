import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDashboardStats } from '@/lib/_dashboard';

export async function GET(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(request.url);
        const characterId = url.searchParams.get('characterId');
        const userId = url.searchParams.get('userId');

        const stats = await getDashboardStats(
            characterId ? BigInt(characterId) : undefined,
            userId || undefined
        );

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}