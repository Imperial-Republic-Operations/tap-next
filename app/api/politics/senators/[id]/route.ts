import { NextRequest, NextResponse } from 'next/server';
import { getSenatorById, updateSenator, deleteSenator, userHasSenateAccess } from '@/lib/_politics';
import { safeStringify } from '@/lib/api';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const { id } = await params;
        const senatorId = BigInt(id);
        const senator = await getSenatorById(senatorId);
        
        if (!senator) {
            return new NextResponse(
                JSON.stringify({ error: 'Senator not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        return new NextResponse(safeStringify(senator), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching senator:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch senator' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const { id } = await params;
        const senatorId = BigInt(id);
        const body = await request.json();
        const { name, seatType, planetId, userId, committeeId } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (seatType !== undefined) updateData.seatType = seatType;
        if (planetId !== undefined) updateData.planetId = BigInt(planetId);
        if (userId !== undefined) updateData.userId = userId;
        if (committeeId !== undefined) updateData.committeeId = committeeId ? BigInt(committeeId) : null;

        const senator = await updateSenator(senatorId, updateData);
        
        return new NextResponse(safeStringify(senator), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating senator:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to update senator' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        const { id } = await params;
        const senatorId = BigInt(id);
        await deleteSenator(senatorId);
        
        return new NextResponse(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error deleting senator:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to delete senator' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}