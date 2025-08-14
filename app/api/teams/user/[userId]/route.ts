import { NextRequest, NextResponse } from "next/server";
import { fetchUser } from "@/lib/_users";
import { safeStringify } from "@/lib/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' }, 
                { status: 400 }
            );
        }
        
        const user = await fetchUser(userId);
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' }, 
                { status: 404 }
            );
        }
        
        // Return user's teams as an array (both primary team and additional teams)
        const allUserTeams = user.team ? [user.team, ...user.teams.filter(t => t.id !== user.team?.id)] : user.teams;
        
        return new Response(safeStringify(allUserTeams), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}