import { NextRequest, NextResponse } from "next/server";
import { updateCharacterApprovalStatus, fetchCharacter } from "@/lib/_characters";
import { safeStringify } from "@/lib/api";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Get session for approving user
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const charId = BigInt(id);
        const body = await request.json();
        const { action } = body; // 'approve' or 'reject'

        if (!action || (action !== 'approve' && action !== 'reject')) {
            return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
        }

        // First, check if the character exists and is pending
        const character = await fetchCharacter(charId);
        if (!character) {
            return NextResponse.json({ error: 'Character not found' }, { status: 404 });
        }

        if (character.approvalStatus !== 'PENDING') {
            return NextResponse.json({ 
                error: 'Only pending characters can be approved or rejected.' 
            }, { status: 400 });
        }

        // Update the approval status
        const status = action === 'approve' ? 'APPROVED' : 'DENIED';
        const result = await updateCharacterApprovalStatus(
            charId, 
            status,
            session.user.id,
            session.user.username,
            session.user.role
        );

        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error updating character approval status:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}