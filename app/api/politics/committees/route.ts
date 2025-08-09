import { NextRequest, NextResponse } from 'next/server';
import { getAllSenateCommittees, createSenateCommittee, userHasSenateAccess } from '@/lib/_politics';
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

        const committees = await getAllSenateCommittees();
        
        return new NextResponse(safeStringify(committees), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching committees:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch committees' }),
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
        const { name, color, temporary, chairId, viceChairId } = body;

        if (!name) {
            return new NextResponse(
                JSON.stringify({ error: 'Missing required field: name' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const committee = await createSenateCommittee({
            name,
            color: color || undefined,
            temporary: temporary || false,
            chairId: chairId ? BigInt(chairId) : undefined,
            viceChairId: viceChairId ? BigInt(viceChairId) : undefined
        });
        
        return new NextResponse(safeStringify(committee), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating committee:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to create committee' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}