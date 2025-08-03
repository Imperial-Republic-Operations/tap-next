import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApprovalStatus, CharacterStatus, Gender } from '@/lib/generated/prisma';
import { safeStringify } from '@/lib/api';
import { handleCharacterForceSensitivity } from '@/lib/_force';

interface CreateCharacterRequest {
    name: string;
    gender: Gender;
    status: CharacterStatus;
    avatarLink?: string;
    speciesId: string;
    homeworldId: string;
    isPersonalCharacter: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { session } = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data: CreateCharacterRequest = await request.json();

        // Validate required fields
        if (!data.name || !data.gender || !data.status || !data.speciesId || !data.homeworldId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate species and homeworld exist
        const [species, homeworld] = await Promise.all([
            prisma.species.findUnique({ where: { id: BigInt(data.speciesId) } }),
            prisma.planet.findUnique({ where: { id: BigInt(data.homeworldId) } })
        ]);

        if (!species) {
            return NextResponse.json({ error: 'Invalid species' }, { status: 400 });
        }

        if (!homeworld) {
            return NextResponse.json({ error: 'Invalid homeworld' }, { status: 400 });
        }

        // Create character with appropriate userId and approvalStatus based on type
        const character = await prisma.character.create({
            data: {
                name: data.name,
                gender: data.gender,
                status: data.status,
                avatarLink: data.avatarLink || null,
                speciesId: BigInt(data.speciesId),
                homeworldId: BigInt(data.homeworldId),
                // Set userId and approvalStatus based on character type
                userId: data.isPersonalCharacter ? session.user.id : null,
                approvalStatus: data.isPersonalCharacter ? ApprovalStatus.DRAFT : null,
                // Initialize other fields with defaults
                age: null,
                appearance: null,
                habits: null,
                strengths: null,
                weaknesses: null,
                hobbies: null,
                talents: null,
                background: null,
            },
            include: {
                species: true,
                homeworld: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                }
            }
        });

        // Handle force sensitivity calculation and ForceProfile creation
        const forceSensitivityResult = await handleCharacterForceSensitivity(
            character.id,
            BigInt(data.speciesId),
            BigInt(data.homeworldId)
        );

        // Include force profile in response if character is force-sensitive
        const responseData = {
            ...character,
            forceProfile: forceSensitivityResult.forceProfile || null,
            isForceSensitive: forceSensitivityResult.isForceSensitive
        };

        return new NextResponse(safeStringify(responseData), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error creating character:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}