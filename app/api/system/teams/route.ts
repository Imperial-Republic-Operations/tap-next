import { NextRequest, NextResponse } from 'next/server';
import { getTeamsSettings, updateTeamsSettings } from '@/lib/_system';
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

        const settings = await getTeamsSettings();
        
        return new NextResponse(safeStringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching teams settings:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch teams settings' }),
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
        const { characterTeamId, moderationTeamId, forceTeamId, operationsTeamId, publicationTeamId } = body;

        const updateData: any = {};
        if (characterTeamId !== undefined) updateData.characterTeamId = BigInt(characterTeamId);
        if (moderationTeamId !== undefined) updateData.moderationTeamId = BigInt(moderationTeamId);
        if (forceTeamId !== undefined) updateData.forceTeamId = BigInt(forceTeamId);
        if (operationsTeamId !== undefined) updateData.operationsTeamId = BigInt(operationsTeamId);
        if (publicationTeamId !== undefined) updateData.publicationTeamId = BigInt(publicationTeamId);

        const settings = await updateTeamsSettings(updateData);
        
        return new NextResponse(safeStringify(settings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating teams settings:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to update teams settings' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}