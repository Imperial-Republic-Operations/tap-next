import { NextRequest, NextResponse } from "next/server";
import { fetchUserProfile } from "@/lib/_users";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: userId } = await params;
        const result = await fetchUserProfile(userId);
        
        if (!result) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}