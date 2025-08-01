import { NextRequest, NextResponse } from "next/server";
import { safeStringify } from "@/lib/api";
import { fetchUserSettings, updateUserSettings } from "@/lib/_users";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: userId } = await params;
        
        const userSettings = await fetchUserSettings(userId);

        return new Response(safeStringify(userSettings), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: userId } = await params;
        const body = await request.json();
        
        // Convert defaultCharacterId to BigInt if provided
        if (body.defaultCharacterId) {
            body.defaultCharacterId = BigInt(body.defaultCharacterId);
        }
        
        const updatedSettings = await updateUserSettings(userId, body);

        return new Response(safeStringify(updatedSettings), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}