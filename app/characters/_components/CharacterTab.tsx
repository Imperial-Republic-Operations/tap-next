'use client'

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Character } from "@/lib/generated/prisma";
import { CharacterProfile, fetchCharacters } from "@/lib/_characters";
import Pagination from "@/components/Pagination";
import { classNames, getProperCapitalization } from "@/lib/style";

export default function CharacterTab({ userId, admin }: { userId: string, admin: boolean }) {
    const [tab, setTab] = useState<'personal' | 'npc'>('personal');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [characters, setCharacters] = useState<CharacterProfile[]>([]);
    const router = useRouter();

    const goToTab = (tab: 'personal' | 'npc') => {
        setTab(tab);
        setPage(0);
    }

    const viewOrSubmit = async (character: Character, missing: string[]) => {
        const status = character.approvalStatus

        if (!status || status === 'APPROVED' || status === 'PENDING') {
            router.push(`/characters/${character.id}`)
        } else if (missing.length === 0) {
            try {
                //await submitCharacter(character.id)
                router.push('/characters')
            } catch (err) {
                console.error('Failed to submit character:', err)
            }
        }
    }

    const getMissingProfileFields = (character: CharacterProfile) => {
        const missing: string[] = [];

        if (!character.age) missing.push("Age");
        if (!character.habits) missing.push("Habits");
        if (!character.strengths) missing.push("Strengths");
        if (!character.weaknesses) missing.push("Weaknesses");
        if (character.interactions.length === 0) missing.push("Interactions");
        if (character.educationHistory.length === 0) missing.push("Educational History");
        if (character.previousPositions.length === 0) missing.push("Career History");
        if (character.goals.length === 0) missing.push("Goals & Ambitions");
        if (!character.background) missing.push("Background");

        return missing;
    }

    const loadCharacters = async (user: string, tabName: 'personal' | 'npc', pageNumber: number) => {
        const {characters, totalPages} = await fetchCharacters(user, tabName, pageNumber);
        setCharacters(characters);
        setTotalPages(totalPages);
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadCharacters(userId, tab, newPage);
    }

    useEffect(() => {
        loadCharacters(userId, tab, page);
    }, [userId, tab, page]);

    return (
        <>
            {admin && (
                <div className="mb-7">
                    <div className="grid grid-cols-1 sm:hidden">
                        <select value={tab} onChange={(e) => goToTab(e.target.value as 'personal' | 'npc')} aria-label="Select a tab" className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600">
                            <option value="personal">Personal Characters</option>
                            <option value="npc">NPC Characters</option>
                        </select>
                        <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500" />
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200 dark:border-gray-800">
                            <nav className="-mb-px justify-center flex" aria-label="Tabs">
                                <a onClick={() => goToTab('personal')} className={classNames(tab !== 'personal' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'personal' && 'page'}>
                                    Personal Characters
                                </a>
                                <a onClick={() => goToTab('npc')} className={classNames(tab !== 'npc' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'npc' && 'page'}>
                                    NPC Characters
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-7">
                {characters.map((character) => {
                    const primaryMembership = character.memberships.find(
                        (member) => member.primaryMembership
                    );

                    return (
                    <li key={character.id}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm dark:divide-gray-700 dark:bg-gray-800">
                        <div className="flex flex-1 flex-col p-8">
                            {character.avatarLink ? (
                                <img className="mx-auto size-32 rounded-full flex-none bg-gray-50 dark:bg-gray-700"
                                     src={character.avatarLink} alt={character.name}/>
                            ) : (
                                <span
                                    className="mx-auto inline-block size-32 overflow-hidden rounded-full bg-gray-50 dark:bg-gray-700">
                                    <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                </span>
                            )}
                            <h3 className="mt-6 text-sm font-medium text-gray-900 dark:text-white">{character.name}</h3>
                            <dl className="mt-1 flex grow flex-col justify-between">
                                <dt className="sr-only">Main Role</dt>
                                {/*<dd className="text-xs text-gray-500 font-bold">
                                    <Marquee className="text-center mx-auto" pauseOnHover={true} speed={20} delay={5}>
                                        {primaryMembership?.position?.name ?? 'Citizen'}
                                    </Marquee>
                                </dd>*/}
                                <dd className="text-xs text-gray-500 font-bold truncate">
                                    {primaryMembership?.position?.name ?? 'Citizen'}
                                </dd>
                                <dt className="sr-only">Main Organization</dt>
                                <dd className="text-xs text-gray-500 italic">
                                    {primaryMembership?.organization?.name ?? 'Unaffiliated'}
                                </dd>
                                <br/>
                                <dt className="sr-only">Status</dt>
                                <dd className="text-sm text-gray-500 font-semibold">{character.status}</dd>
                                <dt className="sr-only">Approval Status</dt>
                                <dd className="mt-3">
                                            <span
                                                className={classNames(
                                                    character.approvalStatus && character.approvalStatus === 'DRAFT' && 'bg-gray-50 text-gray-700 ring-gray-600/20',
                                                    character.approvalStatus && character.approvalStatus === 'PENDING' && 'bg-amber-50 text-amber-700 ring-amber-600/20',
                                                    character.approvalStatus && character.approvalStatus === 'DENIED' && 'bg-red-50 text-red-700 ring-red-600/20',
                                                    character.approvalStatus && character.approvalStatus === 'APPROVED' && 'bg-green-50 text-green-700 ring-green-600/20',
                                                    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset'
                                                )}>
                                                {character.approvalStatus ? getProperCapitalization(character.approvalStatus) : 'NPC' }
                                            </span>
                                </dd>
                            </dl>
                        </div>
                        <div>
                            <div className="-mt-px flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1">
                                    <a
                                        onClick={() => viewOrSubmit(character, getMissingProfileFields(character))}
                                        className="group relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                        {(!character.approvalStatus || character.approvalStatus === 'APPROVED' || character.approvalStatus === 'PENDING') ? 'View' : 'Submit'}
                                        {((character.approvalStatus && character.approvalStatus !== 'APPROVED' && character.approvalStatus !== 'PENDING') && getMissingProfileFields(character).length > 0) && (
                                            <div className="tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded py-1 px-2">
                                                Missing the following fields for submission: <br />
                                                {getMissingProfileFields(character).join('\n')}
                                            </div>
                                        )}
                                    </a>

                                </div>
                                <div className="-ml-px flex w-0 flex-1">
                                    <a href={'/characters/edit/' + character.id} className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 dark:text-white">
                                    Edit
                                </a>
                                </div>
                            </div>
                        </div>
                    </li>
                    )})}
            </ul>
            
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
    );
}