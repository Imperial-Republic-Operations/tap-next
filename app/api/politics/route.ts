import { NextRequest, NextResponse } from 'next/server';
import { getPoliticsHubData } from '@/lib/_politics';
import { safeStringify } from '@/lib/api';

export async function GET(request: NextRequest) {
    try {
        const data = await getPoliticsHubData();
        
        return new NextResponse(safeStringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching politics hub data:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch politics data' }), 
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}