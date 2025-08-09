import { NextRequest, NextResponse } from 'next/server';
import { getSenateCommitteeById, updateSenateCommittee, deleteSenateCommittee, userHasSenateAccess } from '@/lib/_politics';
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
        const committeeId = BigInt(id);
        const committee = await getSenateCommitteeById(committeeId);
        
        if (!committee) {
            return new NextResponse(
                JSON.stringify({ error: 'Committee not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        return new NextResponse(safeStringify(committee), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching committee:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch committee' }),
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
        const committeeId = BigInt(id);
        const body = await request.json();
        const { name, color, temporary, chairId, viceChairId } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (color !== undefined) updateData.color = color;
        if (temporary !== undefined) updateData.temporary = temporary;
        if (chairId !== undefined) updateData.chairId = chairId ? BigInt(chairId) : null;
        if (viceChairId !== undefined) updateData.viceChairId = viceChairId ? BigInt(viceChairId) : null;

        const committee = await updateSenateCommittee(committeeId, updateData);
        
        return new NextResponse(safeStringify(committee), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating committee:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to update committee' }),
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
        const committeeId = BigInt(id);
        await deleteSenateCommittee(committeeId);
        
        return new NextResponse(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error deleting committee:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to delete committee' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}