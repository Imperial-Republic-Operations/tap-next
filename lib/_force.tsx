'use server'

import { prisma } from "@/lib/prisma";
import { ForceLevel } from "@/lib/generated/prisma";

/**
 * Calculate force sensitivity for a new character
 * Formula: Final Probability = Base Probability * Species Modifier * Homeworld Modifier
 * Base Probability = 0.15
 */
export async function calculateForceSensitivity(
    speciesForceProbabilityModifier: number,
    homeworldForceProbabilityModifier: number
): Promise<boolean> {
    const BASE_PROBABILITY = 0.15;
    
    const finalProbability = BASE_PROBABILITY * 
        speciesForceProbabilityModifier * 
        homeworldForceProbabilityModifier;
    
    const randomNumber = Math.random();
    
    return randomNumber < finalProbability;
}

/**
 * Create a ForceProfile for a force-sensitive character
 */
export async function createForceProfile(characterId: bigint): Promise<void> {
    await prisma.forceProfile.create({
        data: {
            id: characterId,
            alignment: null, // Will be determined later based on character development
            level: ForceLevel.POTENTIAL,
            aware: false, // Character starts unaware of their abilities
            masterId: null,
            orderId: null
        }
    });
}

/**
 * Check if character creation should include force sensitivity calculation
 * and create ForceProfile if the character is force-sensitive
 */
export async function handleCharacterForceSensitivity(
    characterId: bigint,
    speciesId: bigint,
    homeworldId: bigint
): Promise<{ isForceSensitive: boolean; forceProfile?: any }> {
    // Get species and homeworld force probability modifiers
    const [species, homeworld] = await Promise.all([
        prisma.species.findUnique({ 
            where: { id: speciesId },
            select: { forceProbabilityModifier: true }
        }),
        prisma.planet.findUnique({ 
            where: { id: homeworldId },
            select: { forceProbabilityModifier: true }
        })
    ]);

    if (!species || !homeworld) {
        throw new Error('Species or homeworld not found');
    }

    const isForceSensitive = await calculateForceSensitivity(
        species.forceProbabilityModifier,
        homeworld.forceProbabilityModifier
    );

    if (isForceSensitive) {
        await createForceProfile(characterId);
        
        // Return the created force profile
        const forceProfile = await prisma.forceProfile.findUnique({
            where: { id: characterId }
        });
        
        return { isForceSensitive: true, forceProfile };
    }

    return { isForceSensitive: false };
}