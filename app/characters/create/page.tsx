'use client'

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { speciesApi, planetsApi } from "@/lib/apiClient";

interface Species {
    id: string;
    name: string;
}

interface Planet {
    id: string;
    name: string;
}

interface FormData {
    name: string;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
    avatarLink: string;
    speciesId: string;
    homeworldId: string;
    isPersonalCharacter: boolean;
}

export default function CreateCharacter() {
    const router = useRouter();
    const { data: session } = useSession();
    const [species, setSpecies] = useState<Species[]>([]);
    const [planets, setPlanets] = useState<Planet[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        gender: 'MALE',
        status: 'ACTIVE',
        avatarLink: '',
        speciesId: '0',
        homeworldId: '0',
        isPersonalCharacter: true
    });

    // Load species and planets
    useEffect(() => {
        if (!session?.user?.id) return;

        const loadData = async () => {
            try {
                setIsLoading(true);
                
                const [speciesRes, planetsRes] = await Promise.all([
                    speciesApi.getSpecies(),
                    planetsApi.getPlanets()
                ]);

                if (!speciesRes.data) new Error('Failed to load species');
                if (!planetsRes.data) new Error('Failed to load planets');

                const speciesData = speciesRes.data;
                const planetsData = planetsRes.data;

                // Sort planets to ensure Deep Space appears first
                const sortedPlanets = [...planetsData].sort((a: Planet, b: Planet) => {
                    if (a.name === 'Deep Space') return -1;
                    if (b.name === 'Deep Space') return 1;
                    return a.name.localeCompare(b.name);
                });

                setSpecies(speciesData);
                setPlanets(sortedPlanets);

                // Set default homeworld to Deep Space if available, otherwise first planet
                const deepSpace = sortedPlanets.find(p => p.name === 'Deep Space');
                const defaultPlanet = deepSpace || sortedPlanets[0];
                if (defaultPlanet) {
                    setFormData(prev => ({ ...prev, homeworldId: defaultPlanet.id }));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [session?.user?.id]);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Reset image error when avatar URL changes
        if (field === 'avatarLink') {
            setImageError(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            
            const response = await fetch('/api/characters/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                new Error(errorData.error || 'Failed to create character');
            }

            router.push('/characters');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create character');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/characters');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error && !isSubmitting) {
        return (
            <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="text-red-800 dark:text-red-200">
                        <h3 className="font-medium">Error</h3>
                        <p className="mt-1 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-5 mb-8">
                <h1 className="text-2xl/7 font-bold text-gray-900 dark:text-white">Create New Character</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Create a new character for the galaxy far, far away.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-12">
                    {/* Character Type Section */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Character Type</h2>
                            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Choose whether this is a personal character or NPC.</p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                            <fieldset className="sm:col-span-6">
                                <legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">Character Type</legend>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center gap-x-3">
                                        <input 
                                            id="personal-character" 
                                            name="characterType" 
                                            type="radio" 
                                            checked={formData.isPersonalCharacter}
                                            onChange={() => handleInputChange('isPersonalCharacter', true)}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:before:hidden checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" 
                                        />
                                        <label htmlFor="personal-character" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                            Personal Character
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input 
                                            id="npc" 
                                            name="characterType" 
                                            type="radio" 
                                            checked={!formData.isPersonalCharacter}
                                            onChange={() => handleInputChange('isPersonalCharacter', false)}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:before:hidden checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" 
                                        />
                                        <label htmlFor="npc" className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                            NPC (Non-Player Character)
                                        </label>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {formData.isPersonalCharacter 
                                        ? "Personal characters are owned by you and start in draft status for approval."
                                        : "NPCs are not owned by any user and don't require approval."
                                    }
                                </p>
                            </fieldset>
                        </div>
                    </div>

                    {/* Basic Information Section */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Essential details about the character.</p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Name *</label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            id="name" 
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                            placeholder="Character Name" 
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="speciesId" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Species *</label>
                                <div className="mt-2 grid grid-cols-1">
                                    <select 
                                        name="speciesId" 
                                        id="speciesId" 
                                        value={formData.speciesId}
                                        onChange={(e) => handleInputChange('speciesId', e.target.value)}
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 dark:*:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                        required
                                    >
                                        <option value="0">--Select a Species--</option>
                                        {species.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <svg className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="homeworldId" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Homeworld *</label>
                                <div className="mt-2 grid grid-cols-1">
                                    <select 
                                        name="homeworldId" 
                                        id="homeworldId" 
                                        value={formData.homeworldId}
                                        onChange={(e) => handleInputChange('homeworldId', e.target.value)}
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white dark:bg-white/5 py-1.5 pr-8 pl-3 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 dark:*:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                        required
                                    >
                                        {planets.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <svg className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                            </div>
                            
                            <fieldset className="sm:col-span-3">
                                <legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">Gender *</legend>
                                <div className="mt-3 flex space-x-5">
                                    <div className="flex items-center gap-x-2">
                                        <input 
                                            id="male" 
                                            name="gender" 
                                            type="radio" 
                                            value="MALE" 
                                            checked={formData.gender === 'MALE'}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:before:hidden checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" 
                                        />
                                        <label htmlFor="male" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Male</label>
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <input 
                                            id="female" 
                                            name="gender" 
                                            type="radio" 
                                            value="FEMALE" 
                                            checked={formData.gender === 'FEMALE'}
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:before:hidden checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" 
                                        />
                                        <label htmlFor="female" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Female</label>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset className="sm:col-span-3">
                                <legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">Status *</legend>
                                <div className="mt-3 space-y-2">
                                    {['ACTIVE', 'INACTIVE', 'DECEASED', 'MISSING', 'RETIRED'].map((status) => (
                                        <div key={status} className="flex items-center gap-x-2">
                                            <input 
                                                id={status.toLowerCase()} 
                                                name="status" 
                                                type="radio" 
                                                value={status} 
                                                checked={formData.status === status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:before:hidden checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden" 
                                            />
                                            <label htmlFor={status.toLowerCase()} className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Avatar</h2>
                            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Optional image to represent the character.</p>
                        </div>

                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                            <div className="col-span-full">
                                <label htmlFor="avatarLink" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Avatar URL</label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                        <input 
                                            type="url" 
                                            name="avatarLink" 
                                            id="avatarLink" 
                                            value={formData.avatarLink}
                                            onChange={(e) => handleInputChange('avatarLink', e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                            placeholder="https://example.com/avatar.jpg" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full text-left">
                                <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Preview</label>
                                {formData.avatarLink && !imageError ? (
                                    <img
                                        className="size-40 flex-none bg-gray-50 dark:bg-gray-700 rounded-md object-cover mt-2"
                                        src={formData.avatarLink}
                                        alt="Avatar preview"
                                        onError={() => setImageError(true)}
                                        onLoad={() => setImageError(false)}
                                    />
                                ) : (
                                    <span className="inline-block size-40 mt-2 overflow-hidden bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                )}
                                {imageError && formData.avatarLink && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        Failed to load image. Please check the URL.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6 mb-8">
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || formData.speciesId === '0' || !formData.name.trim()}
                        className="rounded-md bg-primary-600 dark:bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Character'}
                    </button>
                </div>

                {error && isSubmitting && (
                    <div className="mb-8">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                            <div className="text-red-800 dark:text-red-200">
                                <h3 className="font-medium">Error</h3>
                                <p className="mt-1 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}