import { NextRequest, NextResponse } from 'next/server';
import { getAllSenators, createSenator, userHasSenateAccess } from '@/lib/_politics';
import { safeStringify } from '@/lib/api';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user?.id) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const hasAccess = await userHasSenateAccess(session.user.id);
        if (!hasAccess) {
            return new NextResponse(
                JSON.stringify({ error: 'Access denied' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const senators = await getAllSenators();
        
        return new NextResponse(safeStringify(senators), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching senators:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch senators' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user?.id) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const hasAccess = await userHasSenateAccess(session.user.id);
        if (!hasAccess) {
            return new NextResponse(
                JSON.stringify({ error: 'Access denied' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const body = await request.json();
        const { name, seatType, planetId, userId, committeeId } = body;

        if (!name || !seatType || !planetId) {
            return new NextResponse(
                JSON.stringify({ error: 'Missing required fields: name, seatType, planetId' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const senator = await createSenator({
            name,
            seatType,
            planetId: BigInt(planetId),
            userId: userId || undefined,
            committeeId: committeeId ? BigInt(committeeId) : undefined
        });
        
        return new NextResponse(safeStringify(senator), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating senator:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to create senator' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}