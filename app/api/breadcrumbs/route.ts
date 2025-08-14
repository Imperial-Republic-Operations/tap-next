import { NextRequest, NextResponse } from 'next/server';
import { generateBreadcrumbs } from '@/lib/navigationDB';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { path, params } = await request.json();
        
        if (!path || typeof path !== 'string') {
            return NextResponse.json(
                { error: 'Path is required and must be a string' },
                { status: 400 }
            );
        }

        // Get user session for translations
        const { session } = await getSession();
        
        const breadcrumbs = await generateBreadcrumbs(path, params || {}, session?.user?.id);
        
        return NextResponse.json({ breadcrumbs });
    } catch (error) {
        console.error('Error generating breadcrumbs:', error);
        return NextResponse.json(
            { error: 'Failed to generate breadcrumbs' },
            { status: 500 }
        );
    }
}