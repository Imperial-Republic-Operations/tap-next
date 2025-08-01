'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { roles, userHasAccess } from "@/lib/roles";
import { charactersApi } from "@/lib/apiClient";
import ViewCharacterTab from "@/app/characters/[id]/_components/ViewCharacterTab";
import { useEffect, useState } from "react";
import { CharacterDetails } from "@/lib/types";

export default function ViewCharacter({params}: {params: Promise<{id: string}>}) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [character, setCharacter] = useState<CharacterDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resolvedParams, setResolvedParams] = useState<{id: string} | null>(null);

    // Resolve params
    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    useEffect(() => {
        if (!resolvedParams) return;

        const getID = (value: string): bigint => {
            try {
                const id = BigInt(value);
                if (!id) {
                    router.push('/characters');
                    return BigInt(0);
                }
                return id;
            } catch {
                router.push('/characters');
                return BigInt(0);
            }
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const id = getID(resolvedParams.id);
                if (id === BigInt(0)) return;

                const response = await charactersApi.getCharacter(id);
                const characterData = response.data;

                if (!characterData) {
                    router.push('/characters');
                    return;
                }

                setCharacter(characterData);
            } catch (err) {
                console.error('Failed to fetch character:', err);
                setError('Failed to load character');
                router.push('/characters');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams, router]);

    // Check authorization after session and character are loaded
    useEffect(() => {
        if (status === 'loading' || loading || !character) return;

        if (status === 'unauthenticated') {
            router.push('/characters');
            return;
        }

        if (!session?.user || (!userHasAccess(roles[4], session.user) && (!character?.userId || character.userId !== session.user.id))) {
            router.push('/characters');
            return;
        }
    }, [session, status, character, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600 text-center">
                    <p>{error}</p>
                    <button 
                        onClick={() => router.push('/characters')}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!character) {
        return null;
    }

    return (
        <ViewCharacterTab character={character} />
    );
}