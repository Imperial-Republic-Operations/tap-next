'use server'

import { prisma } from "@/lib/prisma";
import { CodeReason } from "@/lib/generated/prisma";

/**
 * Generates a CodeGen with the specified format:
 * - First 6 characters: Current month, day, year (MMddyy)
 * - Next 2 characters: User initials based on username
 * - Next 1-2 characters: Role abbreviation
 * - Last 3 characters: Random numbers
 */
function generateCode(username: string, role: string): string {
    const now = new Date();
    
    // Format date as MMddyy
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const datePrefix = month + day + year;
    
    // Generate user initials
    const userInitials = getUserInitials(username);
    
    // Generate role abbreviation
    const roleAbbr = getRoleAbbreviation(role);
    
    // Generate 3 random numbers
    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
    return datePrefix + userInitials + roleAbbr + randomNumbers;
}

/**
 * Extract user initials from username
 * - Multiple words: first letter of first two words (capitalized)
 * - Single word: first two letters (capitalized)
 */
function getUserInitials(username: string): string {
    const words = username.trim().split(/\s+/);
    
    if (words.length >= 2) {
        // Multiple words: take the first letter of the first two words
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    } else {
        // Single word: take the first two letters
        return words[0].substring(0, 2).toUpperCase();
    }
}

/**
 * Generate role abbreviation
 * Split by underscore, take the first character of each word
 */
function getRoleAbbreviation(role: string): string {
    return role
        .split('_')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
}

/**
 * Create a CodeGen record
 */
export async function createCodeGen(
    userId: string,
    username: string,
    role: string,
    reason: CodeReason,
    purpose: string,
    characterId?: bigint,
    documentId?: bigint
) {
    const code = generateCode(username, role);
    
    return prisma.codeGen.create({
        data: {
            code,
            reason,
            purpose,
            userId,
            characterId: characterId || null,
            documentId: documentId || null,
        },
        select: {
            id: true,
            code: true,
            reason: true,
            purpose: true,
            createdAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                }
            },
            character: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
}

/**
 * Create a CodeGen specifically for character approval
 */
export async function createCharacterApprovalCode(
    userId: string,
    username: string,
    role: string,
    characterId: bigint
) {
    return await createCodeGen(
        userId,
        username,
        role,
        CodeReason.CHARACTER_APPROVAL,
        "Character approval",
        characterId
    );
}