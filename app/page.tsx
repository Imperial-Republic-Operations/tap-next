'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CharacterDetails } from "@/lib/types";
import { charactersApi, dashboardApi } from "@/lib/apiClient";
import HomeClient from "@/app/_components/HomeClient";
import Cookies from "js-cookie";
import axios from "axios";

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

export default function Home() {
    const { data: session, status } = useSession();
    const [activeCharacter, setActiveCharacter] = useState<CharacterDetails | undefined>(undefined);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        totalCharacters: 0,
        totalOrganizations: 0,
        totalDocuments: 0,
        totalAwards: 0,
        pendingCharacters: 0,
        pendingDocuments: 0,
        flaggedDocuments: 0,
        characterCredits: 0,
        characterYearsOfService: 0,
        characterCompletedMissions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (session?.user) {
                    // Fetch active character
                    const activeCharacterId = Cookies.get("activeCharacterId");
                    let character;

                    if (activeCharacterId) {
                        const response = await charactersApi.getCharacter(BigInt(activeCharacterId));
                        character = response.data;
                        setActiveCharacter(character);
                    } else {
                        // Fetch user settings to get default character
                        const response = await axios.get(`/api/users/${session.user.id}/settings`);
                        const userSettings = response.data;
                        
                        if (userSettings?.defaultCharacter) {
                            character = userSettings.defaultCharacter;
                            setActiveCharacter(character);
                        }
                    }
                    
                    // Fetch full dashboard stats for authenticated users
                    const statsResponse = await dashboardApi.getStats(
                        character?.id, 
                        session.user.id
                    );
                    setDashboardStats(statsResponse.data);
                } else {
                    // Fetch public stats for non-authenticated users
                    const publicStatsResponse = await dashboardApi.getPublicStats();
                    const publicStats = publicStatsResponse.data;
                    
                    // Merge with default dashboard stats structure
                    setDashboardStats({
                        ...dashboardStats,
                        totalCharacters: publicStats.totalCharacters,
                        totalOrganizations: publicStats.totalOrganizations,
                        totalDocuments: publicStats.totalDocuments,
                        totalAwards: publicStats.totalAwards
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (session?.user) {
                    setActiveCharacter(undefined);
                }
            }
            setLoading(false);
        };

        if (status !== 'loading') {
            fetchData();
        }
    }, [session, status]);

    if (loading || status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <HomeClient 
            session={session} 
            status={status as 'authenticated' | 'unauthenticated'} 
            activeCharacter={activeCharacter}
            dashboardStats={dashboardStats}
            statsLoading={loading}
        />
    );
}