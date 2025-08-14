import { NextRequest, NextResponse } from "next/server";
import { addUserToTeam, removeUserFromTeam } from "@/lib/_users";
import { safeStringify } from "@/lib/api";

export async function POST(request: NextRequest) {
    try {
        const { userId, teamId } = await request.json();
        
        if (!userId || !teamId) {
            return NextResponse.json(
                { error: 'userId and teamId are required' }, 
                { status: 400 }
            );
        }
        
        const result = await addUserToTeam(userId, teamId);
        
        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId, teamId } = await request.json();
        
        if (!userId || !teamId) {
            return NextResponse.json(
                { error: 'userId and teamId are required' }, 
                { status: 400 }
            );
        }
        
        const result = await removeUserFromTeam(userId, teamId);
        
        return new Response(safeStringify(result), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}