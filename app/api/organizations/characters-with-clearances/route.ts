import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { fetchCharactersWithClearances } from '@/lib/_organizations';
import { safeStringify } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const characters = await fetchCharactersWithClearances();
        return new NextResponse(safeStringify(characters), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching characters with clearances:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}