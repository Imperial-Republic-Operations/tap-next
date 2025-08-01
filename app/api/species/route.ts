import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeStringify } from '@/lib/api';

export async function GET() {
    try {
        const species = await prisma.species.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        return new Response(safeStringify(species), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error fetching species:', error);
        return NextResponse.json(
            { error: 'Failed to fetch species' },
            { status: 500 }
        );
    }
}