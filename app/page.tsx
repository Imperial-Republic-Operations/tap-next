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
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
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

    const syncActiveCharacterId = () => {
        const id = Cookies.get('activeCharacterId');
        setActiveCharacterId(id || null);
    };

    const fetchActiveCharacter = async (characterId: string) => {
        try {
            const response = await charactersApi.getCharacter(BigInt(characterId));
            setActiveCharacter(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching active character:', error);
            setActiveCharacter(undefined);
            return undefined;
        }
    };

    const fetchDefaultCharacter = async () => {
        if (!session?.user) return undefined;
        
        try {
            const response = await axios.get(`/api/users/${session.user.id}/settings`);
            const userSettings = response.data;
            
            if (userSettings?.defaultCharacter) {
                setActiveCharacter(userSettings.defaultCharacter);
                return userSettings.defaultCharacter;
            }
        } catch (error) {
            console.error('Error fetching default character:', error);
        }
        return undefined;
    };

    const fetchDashboardStats = async (character?: CharacterDetails) => {
        try {
            if (session?.user) {
                const statsResponse = await dashboardApi.getStats(
                    character?.id, 
                    session.user.id
                );
                setDashboardStats(statsResponse.data);
            } else {
                const publicStatsResponse = await dashboardApi.getPublicStats();
                const publicStats = publicStatsResponse.data;
                
                setDashboardStats({
                    ...dashboardStats,
                    totalCharacters: publicStats.totalCharacters,
                    totalOrganizations: publicStats.totalOrganizations,
                    totalDocuments: publicStats.totalDocuments,
                    totalAwards: publicStats.totalAwards
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    // Listen for active character changes
    useEffect(() => {
        syncActiveCharacterId();

        const handleActiveCharacterChange = () => {
            syncActiveCharacterId();
        };

        window.addEventListener('activeCharacterChanged', handleActiveCharacterChange);

        return () => {
            window.removeEventListener('activeCharacterChanged', handleActiveCharacterChange);
        };
    }, []);

    // Handle active character ID changes
    useEffect(() => {
        if (status === 'loading') return;

        const loadData = async () => {
            setLoading(true);
            let character;

            if (session?.user && activeCharacterId) {
                character = await fetchActiveCharacter(activeCharacterId);
            } else if (session?.user && !activeCharacterId) {
                character = await fetchDefaultCharacter();
            } else if (!session?.user) {
                // User is not authenticated, clear any cached character data and cookies
                setActiveCharacter(undefined);
                setActiveCharacterId(null);
                Cookies.remove('activeCharacterId');
            }

            await fetchDashboardStats(character);
            setLoading(false);
        };

        loadData();
    }, [activeCharacterId, session, status]);

    if (status === 'loading' || (loading && session?.user)) {
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