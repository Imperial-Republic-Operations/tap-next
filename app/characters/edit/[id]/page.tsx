'use client'

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    CharacterEducation, CharacterGoal,
    CharacterHonor,
    CharacterInteraction,
    CharacterPreviousPosition,
    CharacterProfile
} from "@/lib/types";
import { charactersApi, speciesApi, planetsApi } from "@/lib/apiClient";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

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
    age: number | null;
    speciesId: string;
    homeworldId: string;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'MISSING' | 'RETIRED';
    avatarLink: string;
    appearance: string;
    habits: string;
    strengths: string;
    weaknesses: string;
    hobbies: string;
    talents: string;
    background: string;
    interactions: string[];
    previousPositions: string[];
    educationHistory: string[];
    honors: string[];
    goals: string[];
}

export default function EditCharacter({params}: {params: Promise<{id: string}>}) {
    const router = useRouter();
    const { data: session } = useSession();
    const [character, setCharacter] = useState<CharacterProfile | null>(null);
    const [species, setSpecies] = useState<Species[]>([]);
    const [planets, setPlanets] = useState<Planet[]>([]);
    const [resolvedParams, setResolvedParams] = useState<{id: string} | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        age: null,
        speciesId: '0',
        homeworldId: '0',
        gender: 'MALE',
        status: 'ACTIVE',
        avatarLink: '',
        appearance: '',
        habits: '',
        strengths: '',
        weaknesses: '',
        hobbies: '',
        talents: '',
        background: '',
        interactions: [''],
        previousPositions: [''],
        educationHistory: [''],
        honors: [''],
        goals: ['']
    });

    // Resolve params
    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    // Load data when params are resolved
    useEffect(() => {
        if (!resolvedParams || !session?.user?.id) return;

        const loadData = async () => {
            try {
                setIsLoading(true);
                const id = BigInt(resolvedParams.id);
                
                const [characterRes, speciesRes, planetsRes] = await Promise.all([
                    charactersApi.getCharacter(id),
                    speciesApi.getSpecies(),
                    planetsApi.getPlanets()
                ]);

                if (!characterRes.data) new Error('Character not found');
                if (!speciesRes.data) new Error('Failed to load species');
                if (!planetsRes.data) new Error('Failed to load planets');

                const character = characterRes.data;
                const speciesData = speciesRes.data;
                const planetsData = planetsRes.data;

                // Sort planets to ensure Deep Space appears first
                const sortedPlanets = [...planetsData].sort((a: Planet, b: Planet) => {
                    if (a.name === 'Deep Space') return -1;
                    if (b.name === 'Deep Space') return 1;
                    return a.name.localeCompare(b.name);
                });

                setCharacter(character);
                setSpecies(speciesData);
                setPlanets(sortedPlanets);

                // Populate form with character data
                setFormData({
                    name: character.name,
                    age: character.age,
                    speciesId: character.speciesId.toString(),
                    homeworldId: character.homeworldId.toString(),
                    gender: character.gender,
                    status: character.status,
                    avatarLink: character.avatarLink || '',
                    appearance: character.appearance || '',
                    habits: character.habits || '',
                    strengths: character.strengths || '',
                    weaknesses: character.weaknesses || '',
                    hobbies: character.hobbies || '',
                    talents: character.talents || '',
                    background: character.background || '',
                    interactions: character.interactions?.length ? character.interactions.map((i: CharacterInteraction) => i.interaction) : [''],
                    previousPositions: character.previousPositions?.length ? character.previousPositions.map((p: CharacterPreviousPosition) => p.position) : [''],
                    educationHistory: character.educationHistory?.length ? character.educationHistory.map((e: CharacterEducation) => e.education) : [''],
                    honors: character.honors?.length ? character.honors.map((h: CharacterHonor) => h.honor) : [''],
                    goals: character.goals?.length ? character.goals.map((g: CharacterGoal) => g.goal) : ['']
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load character data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [resolvedParams, session?.user?.id]);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Reset image error when avatar URL changes
        if (field === 'avatarLink') {
            setImageError(false);
        }
    };

    const handleArrayChange = (field: keyof FormData, index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field: keyof FormData) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as string[]), '']
        }));
    };

    const removeArrayItem = (field: keyof FormData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resolvedParams) return;

        try {
            setIsSubmitting(true);
            
            const response = await fetch(`/api/characters/${resolvedParams.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                new Error('Failed to update character');
            }

            router.push('/characters');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update character');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/characters');
    };

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">Error: {error}</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                {/* Basics Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basics</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Biographic information about the character.</p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Name</label>
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

                        <div className="sm:col-span-2">
                            <label htmlFor="age" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Age</label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                    <input 
                                        type="number" 
                                        name="age" 
                                        id="age" 
                                        value={formData.age || ''}
                                        onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                        placeholder="Character Age" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="speciesId" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Species</label>
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
                            <label htmlFor="homeworldId" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Homeworld</label>
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
                        
                        <fieldset className="sm:col-span-2">
                            <legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">Gender</legend>
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

                        <fieldset>
                            <legend className="text-sm/6 font-semibold text-gray-900 dark:text-white">Status</legend>
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
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

                        <div className="col-span-full">
                            <label htmlFor="appearance" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Appearance</label>
                            <div className="mt-2">
                                <textarea 
                                    name="appearance" 
                                    id="appearance" 
                                    rows={3} 
                                    value={formData.appearance}
                                    onChange={(e) => handleInputChange('appearance', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Avatar</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Image used to represent your character.</p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="col-span-full">
                            <label htmlFor="avatarLink" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Avatar Link</label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                    <input 
                                        type="url" 
                                        name="avatarLink" 
                                        id="avatarLink" 
                                        value={formData.avatarLink}
                                        onChange={(e) => handleInputChange('avatarLink', e.target.value)}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                        placeholder="Avatar URL" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full text-left">
                            <label className="block text-sm/6 font-medium text-gray-900 dark:text-white">Preview</label>
                            {formData.avatarLink && !imageError ? (
                                <img
                                    className="size-40 flex-none bg-gray-50 dark:bg-gray-700 rounded-md object-cover"
                                    src={formData.avatarLink}
                                    alt="Avatar preview"
                                    onError={() => setImageError(true)}
                                    onLoad={() => setImageError(false)}
                                />
                            ) : (
                                <span className="inline-block size-40 -mb-1.5 overflow-hidden bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            )}
                            {/*{imageError && formData.avatarLink && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    Failed to load image. Please check the URL.
                                </p>
                            )}*/}
                        </div>
                    </div>
                </div>

                {/* Personality Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personality</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Information on the character&apos;s behavior.</p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="col-span-full">
                            <label htmlFor="habits" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Habits</label>
                            <div className="mt-2">
                                <textarea 
                                    name="habits" 
                                    id="habits" 
                                    rows={3} 
                                    value={formData.habits}
                                    onChange={(e) => handleInputChange('habits', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="strengths" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Strengths</label>
                            <div className="mt-2">
                                <textarea 
                                    name="strengths" 
                                    id="strengths" 
                                    rows={3} 
                                    value={formData.strengths}
                                    onChange={(e) => handleInputChange('strengths', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="weaknesses" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Weaknesses</label>
                            <div className="mt-2">
                                <textarea 
                                    name="weaknesses" 
                                    id="weaknesses" 
                                    rows={3} 
                                    value={formData.weaknesses}
                                    onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="hobbies" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Hobbies</label>
                            <div className="mt-2">
                                <textarea 
                                    name="hobbies" 
                                    id="hobbies" 
                                    rows={3} 
                                    value={formData.hobbies}
                                    onChange={(e) => handleInputChange('hobbies', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="talents" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Talents</label>
                            <div className="mt-2">
                                <textarea 
                                    name="talents" 
                                    id="talents" 
                                    rows={3} 
                                    value={formData.talents}
                                    onChange={(e) => handleInputChange('talents', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactions Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Interactions with Others</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Information on how the character interacts with those around them.</p>
                        <button 
                            type="button" 
                            onClick={() => addArrayItem('interactions')}
                            className="flex mt-2 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                        >
                            <PlusIcon className="-ml-0.5 size-4 text-gray-400" />
                            Add Interaction
                        </button>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {formData.interactions.map((interaction, index) => (
                            <div key={index} className="col-span-full">
                                <label htmlFor={`interaction-${index}`} className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                    Interaction #{index + 1}
                                </label>
                                <div className="mt-2">
                                    <textarea 
                                        id={`interaction-${index}`} 
                                        rows={3} 
                                        value={interaction}
                                        onChange={(e) => handleArrayChange('interactions', index, e.target.value)}
                                        className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => removeArrayItem('interactions', index)}
                                        className="flex mt-1 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                                    >
                                        <MinusIcon className="-ml-0.5 size-4 text-gray-400" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Career/Education Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Career/Education</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Information about the character&apos;s past work and education.</p>
                        <button 
                            type="button" 
                            onClick={() => addArrayItem('educationHistory')}
                            className="flex mt-2 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                        >
                            <PlusIcon className="-ml-0.5 size-4 text-gray-400" />
                            Add Education
                        </button>
                        <button 
                            type="button" 
                            onClick={() => addArrayItem('previousPositions')}
                            className="flex mt-4 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                        >
                            <PlusIcon className="-ml-0.5 size-4 text-gray-400" />
                            Add Career
                        </button>
                        <button 
                            type="button" 
                            onClick={() => addArrayItem('honors')}
                            className="flex mt-4 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                        >
                            <PlusIcon className="-ml-0.5 size-4 text-gray-400" />
                            Add Honor
                        </button>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {/* Education History */}
                        <h3 className="text-lg font-semibold col-span-full text-gray-900 dark:text-white -mb-5">Educational History</h3>
                        {formData.educationHistory.map((education, index) => (
                            <div key={index} className="col-span-full">
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                        <input 
                                            type="text" 
                                            id={`education-${index}`} 
                                            value={education}
                                            onChange={(e) => handleArrayChange('educationHistory', index, e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                            placeholder="Education" 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => removeArrayItem('educationHistory', index)}
                                            className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                                        >
                                            <MinusIcon className="-ml-0.5 size-4 text-gray-400" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Career History */}
                        <h3 className="text-lg font-semibold col-span-full text-gray-900 dark:text-white mt-3 -mb-5">Career History</h3>
                        {formData.previousPositions.map((position, index) => (
                            <div key={index} className="col-span-full">
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                        <input 
                                            type="text" 
                                            id={`position-${index}`} 
                                            value={position}
                                            onChange={(e) => handleArrayChange('previousPositions', index, e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                            placeholder="Career Position" 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => removeArrayItem('previousPositions', index)}
                                            className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                                        >
                                            <MinusIcon className="-ml-0.5 size-4 text-gray-400" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Awards & Honors */}
                        <h3 className="text-lg font-semibold col-span-full text-gray-900 dark:text-white mt-3 -mb-5">Awards & Honors</h3>
                        {formData.honors.map((honor, index) => (
                            <div key={index} className="col-span-full">
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white dark:bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-600 dark:focus-within:outline-primary-500">
                                        <input 
                                            type="text" 
                                            id={`honor-${index}`} 
                                            value={honor}
                                            onChange={(e) => handleArrayChange('honors', index, e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none sm:text-sm/6" 
                                            placeholder="Award/Honor" 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => removeArrayItem('honors', index)}
                                            className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                                        >
                                            <MinusIcon className="-ml-0.5 size-4 text-gray-400" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Goals Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Goals and Ambitions</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Information about what the character hopes to work towards.</p>
                        <button 
                            type="button" 
                            onClick={() => addArrayItem('goals')}
                            className="flex mt-2 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                        >
                            <PlusIcon className="-ml-0.5 size-4 text-gray-400" />
                            Add Goal
                        </button>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        {formData.goals.map((goal, index) => (
                            <div key={index} className="col-span-full">
                                <label htmlFor={`goal-${index}`} className="block text-sm/6 font-medium text-gray-900 dark:text-white">
                                    Goal/Ambition #{index + 1}
                                </label>
                                <div className="mt-2">
                                    <textarea 
                                        id={`goal-${index}`} 
                                        rows={3} 
                                        value={goal}
                                        onChange={(e) => handleArrayChange('goals', index, e.target.value)}
                                        className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => removeArrayItem('goals', index)}
                                        className="flex mt-1 shrink-0 items-center gap-x-1.5 rounded-md bg-white dark:bg-white/5 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600"
                                    >
                                        <MinusIcon className="-ml-0.5 size-4 text-gray-400" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Background Section */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-white/10 pb-12 md:grid-cols-3">
                    <div>
                        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Background</h2>
                        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Story of the character&apos;s journey to this point.</p>
                    </div>

                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                        <div className="col-span-full">
                            <label htmlFor="background" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Background</label>
                            <div className="mt-2">
                                <textarea 
                                    name="background" 
                                    id="background" 
                                    rows={3} 
                                    value={formData.background}
                                    onChange={(e) => handleInputChange('background', e.target.value)}
                                    className="block w-full rounded-md bg-white dark:bg-white/5 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-white/10 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:focus:outline-primary-500 sm:text-sm/6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex items-center justify-end gap-x-6 mb-3">
                <button 
                    type="button" 
                    onClick={handleCancel}
                    className="text-sm/6 font-semibold text-gray-900 dark:text-white"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting || formData.speciesId === '0' || formData.homeworldId === '0' || !formData.name}
                    className="rounded-md bg-primary-600 dark:bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}