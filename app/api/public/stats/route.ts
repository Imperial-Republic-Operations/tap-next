import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // Get public stats that can be shown to everyone
        const [
            totalCharacters,
            totalOrganizations,
            totalGameDocs,
            totalOrgDocs,
            totalPersonalDocs,
            totalAwards
        ] = await Promise.all([
            // Total active characters
            prisma.character.count({
                where: { status: 'ACTIVE' }
            }),
            
            // Total organizations
            prisma.organization.count(),
            
            // Total game documents
            prisma.gameDocument.count(),
            
            // Total organization documents
            prisma.organizationDocument.count(),
            
            // Total personal documents
            prisma.personalDocument.count(),
            
            // Total character awards (granted awards)
            prisma.characterAward.count({
                where: { status: 'AWARDED' }
            })
        ]);
        
        const totalDocuments = totalGameDocs + totalOrgDocs + totalPersonalDocs;

        const stats = {
            totalCharacters,
            totalOrganizations,
            totalDocuments,
            totalAwards
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching public stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}