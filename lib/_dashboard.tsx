import { prisma } from '@/lib/prisma';

interface DashboardStats {
    totalCharacters: number;
    totalOrganizations: number;
    totalDocuments: number;
    totalAwards: number;
    pendingCharacters: number;
    pendingDocuments: number;
    flaggedDocuments: number;
    characterCredits: number;
    characterYearsOfService: number;
    characterCompletedMissions: number;
}

export async function getDashboardStats(
    characterId?: bigint,
    userId?: string
): Promise<DashboardStats> {
    try {
        // Get global stats
        const [
            totalCharacters,
            totalOrganizations,
            totalGameDocs,
            totalOrgDocs,
            totalPersonalDocs,
            totalAwards,
            pendingCharacters,
            pendingGameDocs,
            pendingOrgDocs,
            pendingPersonalDocs
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
            }),
            
            // Pending character approvals
            prisma.character.count({
                where: { approvalStatus: 'PENDING' }
            }),
            
            // Pending game documents (FOR_REVIEW status)
            prisma.gameDocument.count({
                where: { status: 'FOR_REVIEW' }
            }),
            
            // Pending organization documents (FOR_REVIEW status)
            prisma.organizationDocument.count({
                where: { status: 'FOR_REVIEW' }
            }),
            
            // Pending personal documents (FOR_REVIEW status)
            prisma.personalDocument.count({
                where: { status: 'FOR_REVIEW' }
            })
        ]);
        
        const totalDocuments = totalGameDocs + totalOrgDocs + totalPersonalDocs;
        const pendingDocuments = pendingGameDocs + pendingOrgDocs + pendingPersonalDocs;

        // Initialize character-specific stats
        let characterCredits = 0;
        let characterYearsOfService = 0; 
        let characterCompletedMissions = 0;

        // Get character-specific stats if character ID provided
        if (characterId) {
            const character = await prisma.character.findUnique({
                where: { id: characterId },
                select: {
                    createdAt: true,
                    creditAccount: {
                        select: {
                            balance: true
                        }
                    }
                }
            });

            if (character) {
                characterCredits = character.creditAccount?.balance || 0;
                
                // Calculate years of service
                const createdAt = new Date(character.createdAt);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - createdAt.getTime());
                characterYearsOfService = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
                
                // TODO: Get completed missions count when mission system is implemented
                characterCompletedMissions = 0;
            }
        }

        return {
            totalCharacters,
            totalOrganizations,
            totalDocuments,
            totalAwards,
            pendingCharacters,
            pendingDocuments,
            flaggedDocuments: 0, // Placeholder until flagged field is added
            characterCredits,
            characterYearsOfService,
            characterCompletedMissions
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}