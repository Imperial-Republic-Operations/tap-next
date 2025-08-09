import { NextRequest, NextResponse } from 'next/server';
import { getHighCouncilSettings, updateHighCouncilSettings } from '@/lib/_system';
import { userHasAccess } from '@/lib/roles';
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

        if (!userHasAccess('ADMIN', session.user)) {
            return new NextResponse(
                JSON.stringify({ error: 'Access denied' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const settings = await getHighCouncilSettings();
        
        return new NextResponse(safeStringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching high council settings:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch high council settings' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function PUT(request: NextRequest) {
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

        if (!userHasAccess('ADMIN', session.user)) {
            return new NextResponse(
                JSON.stringify({ error: 'Access denied' }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const body = await request.json();
        const { chairmanPositionId, viceChairmanPositionId, highCouncilorPositionId, honoraryHighCouncilorPositionId } = body;

        const updateData: any = {};
        if (chairmanPositionId !== undefined) updateData.chairmanPositionId = BigInt(chairmanPositionId);
        if (viceChairmanPositionId !== undefined) updateData.viceChairmanPositionId = BigInt(viceChairmanPositionId);
        if (highCouncilorPositionId !== undefined) updateData.highCouncilorPositionId = BigInt(highCouncilorPositionId);
        if (honoraryHighCouncilorPositionId !== undefined) updateData.honoraryHighCouncilorPositionId = BigInt(honoraryHighCouncilorPositionId);

        const settings = await updateHighCouncilSettings(updateData);
        
        return new NextResponse(safeStringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating high council settings:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to update high council settings' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}