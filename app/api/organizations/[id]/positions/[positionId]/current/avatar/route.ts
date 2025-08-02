import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_AVATAR_URL = 'https://images.eotir.com/avatars/fnf.jpg';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; positionId: string }> }
) {
    try {
        const { id: orgId, positionId } = await params;
        
        // Find the current member holding this position
        const member = await prisma.member.findFirst({
            where: {
                organizationId: BigInt(orgId),
                positionId: BigInt(positionId),
                // Optionally add status check if needed
                // character: { status: 'ACTIVE' }
            },
            include: {
                character: {
                    select: {
                        avatarLink: true,
                    }
                }
            }
        });

        // Determine which avatar URL to use
        let avatarUrl = DEFAULT_AVATAR_URL;
        if (member?.character?.avatarLink) {
            avatarUrl = member.character.avatarLink;
        }

        // Fetch the image from the URL
        const imageResponse = await fetch(avatarUrl);
        
        if (!imageResponse.ok) {
            // If the character's avatar fails to load, fall back to default
            const fallbackResponse = await fetch(DEFAULT_AVATAR_URL);
            if (!fallbackResponse.ok) {
                return NextResponse.json({ error: 'Failed to load avatar' }, { status: 500 });
            }
            
            const fallbackImageBuffer = await fallbackResponse.arrayBuffer();
            return new NextResponse(fallbackImageBuffer, {
                headers: {
                    'Content-Type': fallbackResponse.headers.get('Content-Type') || 'image/jpeg',
                    'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                }
            });
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            }
        });

    } catch (error) {
        console.error('Error fetching position avatar:', error);
        
        // Return default avatar on any error
        try {
            const fallbackResponse = await fetch(DEFAULT_AVATAR_URL);
            if (fallbackResponse.ok) {
                const fallbackImageBuffer = await fallbackResponse.arrayBuffer();
                return new NextResponse(fallbackImageBuffer, {
                    headers: {
                        'Content-Type': fallbackResponse.headers.get('Content-Type') || 'image/jpeg',
                        'Cache-Control': 'public, max-age=3600',
                    }
                });
            }
        } catch (fallbackError) {
            console.error('Error fetching fallback avatar:', fallbackError);
        }
        
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}