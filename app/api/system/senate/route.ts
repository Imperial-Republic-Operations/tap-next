import { NextRequest, NextResponse } from 'next/server';
import { getSenateSettings, updateSenateSettings } from '@/lib/_system';
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

        const settings = await getSenateSettings();
        
        return new NextResponse(safeStringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching senate settings:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch senate settings' }),
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
        const { supremeRulerPositionId, presidentPositionId, vicePresidentPositionId } = body;

        const updateData: any = {};
        if (supremeRulerPositionId !== undefined) updateData.supremeRulerPositionId = BigInt(supremeRulerPositionId);
        if (presidentPositionId !== undefined) updateData.presidentPositionId = BigInt(presidentPositionId);
        if (vicePresidentPositionId !== undefined) updateData.vicePresidentPositionId = BigInt(vicePresidentPositionId);

        const settings = await updateSenateSettings(updateData);
        
        return new NextResponse(safeStringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating senate settings:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to update senate settings' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}