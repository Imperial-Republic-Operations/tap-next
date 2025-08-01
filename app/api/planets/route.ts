import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { safeStringify } from '@/lib/api';

export async function GET() {
    try {
        const planets = await prisma.planet.findMany({
            where: {
                habitable: true
            },
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        return new Response(safeStringify(planets), { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error fetching planets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch planets' },
            { status: 500 }
        );
    }
}