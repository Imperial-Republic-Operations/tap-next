import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userHasAccess, roles } from "@/lib/roles";
import { fetchAllUsers, updateUserRole } from "@/lib/_users";
import { safeStringify } from "@/lib/api";

export async function GET(request: NextRequest) {
    try {
        const { session } = await getSession();
        
        // Only admins can view all users
        if (!userHasAccess(roles[5], session?.user)) { // ADMIN level
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '0');
        const search = url.searchParams.get('search') || '';
        const roleFilter = url.searchParams.get('role') || '';

        const result = await fetchAllUsers(page, search, roleFilter);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { session } = await getSession();
        
        // Only admins can update user roles
        if (!userHasAccess(roles[5], session?.user)) { // ADMIN level
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { userId, role } = await request.json();
        
        // Validate role
        if (!roles.includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Prevent changing own role unless SYSTEM_ADMIN
        if (userId === session?.user?.id && !userHasAccess(roles[6], session?.user)) {
            return NextResponse.json({ error: "Cannot change your own role" }, { status: 403 });
        }

        const result = await updateUserRole(userId, role);
        return new Response(safeStringify(result), { headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}