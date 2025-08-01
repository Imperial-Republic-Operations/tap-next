'use client'

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { $Enums, Gender, HonoraryTitle } from "@/lib/generated/prisma";
import { classNames, getMultiWordCapitalization, getProperCapitalization } from "@/lib/style";
import { useState } from "react";
import { CharacterDetails, CharacterForceProfile, CharacterMembership } from "@/lib/types";
import { useSession } from "next-auth/react";
import { roles, userHasAccess } from "@/lib/roles";
import { charactersApi } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import DomainRank = $Enums.DomainRank;

const mannerOfAddressMap: Record<DomainRank | HonoraryTitle, Record<Gender, string>> = {
    KINGDOM: { MALE: "His Majesty", FEMALE: "Her Majesty" },
    KINGDOM_HEIR: { MALE: "His Royal Highness", FEMALE: "Her Royal Highness" },
    PRINCIPALITY: { MALE: "His Serene Highness", FEMALE: "Her Serene Highness" },
    DUCHY: { MALE: "His Grace", FEMALE: "Her Grace" },
    MARQUESSATE: { MALE: "His Lordship", FEMALE: "Her Ladyship" },
    EARLDOM: { MALE: "His Lordship", FEMALE: "Her Ladyship" },
    VISCOUNTCY: { MALE: "His Lordship", FEMALE: "Her Ladyship" },
    BARONY: { MALE: "His Lordship", FEMALE: "Her Ladyship" },

    DOWAGER_EMPRESS: { MALE: "", FEMALE: "Her Royal Highness" },
    QUEEN_DOWAGER: { MALE: "", FEMALE: "Her Royal Highness" },
    PRINCE: { MALE: "His Highness", FEMALE: "" },
    PRINCESS: { MALE: "", FEMALE: "Her Highness" },
    LORD: { MALE: "His Lordship", FEMALE: "" },
    LADY: { MALE: "", FEMALE: "Her Ladyship" },
    KNIGHT: { MALE: "Sir", FEMALE: "" },
    DAME: { MALE: "", FEMALE: "Madam" },
};

export default function ViewCharacterTab({ character }: { character: CharacterDetails }) {
    const [tab, setTab] = useState<'details' | 'positions' | 'signature' | 'force'>('details');
    const [claiming, setClaiming] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    const primaryMembership = character.memberships?.find(
        (member) => member.primaryMembership
    );

    const getMannerOfAddress = (gender: Gender, domainRank?: DomainRank, honoraryTile?: HonoraryTitle) => {
        const highPeerage = ["KINGDOM", "KINGDOM_HEIR", "PRINCIPALITY"];
        const overrideHonoraries = ["DOWAGER_EMPRESS", "QUEEN_DOWAGER", "PRINCE", "PRINCESS"];

        if (domainRank && highPeerage.includes(domainRank)) return mannerOfAddressMap[domainRank]?.[gender] ?? "";

        if (domainRank && honoraryTile && overrideHonoraries.includes(honoraryTile)) return mannerOfAddressMap[honoraryTile]?.[gender] ?? "";

        if (domainRank) return mannerOfAddressMap[domainRank]?.[gender] ?? "";

        if (honoraryTile) return mannerOfAddressMap[honoraryTile]?.[gender] ?? "";

        return "";
    };

    const getPeerageTitle = (gender: Gender, domainRank: DomainRank) => {
        if (gender === 'MALE') {
            switch (domainRank) {
                case "KINGDOM":
                    return "King";
                case "KINGDOM_HEIR":
                case "PRINCIPALITY":
                    return "Prince";
                case "DUCHY":
                    return "Duke";
                case "MARQUESSATE":
                    return "Marquess";
                case "EARLDOM":
                    return "Count";
                case "VISCOUNTCY":
                    return "Viscount";
                case "BARONY":
                    return "Baron";
            }
        } else {
            switch (domainRank) {
                case "KINGDOM":
                    return "Queen";
                case "KINGDOM_HEIR":
                case "PRINCIPALITY":
                    return "Princess";
                case "DUCHY":
                    return "Duchess";
                case "MARQUESSATE":
                    return "Marchioness";
                case "EARLDOM":
                    return "Countess";
                case "VISCOUNTCY":
                    return "Viscountess";
                case "BARONY":
                    return "Baroness";
            }
        }
    };

    const getSignatureTitle = () => {
        if (character.peerage?.peerageRank) {
            return getPeerageTitle(character.gender, character.peerage.peerageRank) + " ";
        } else if (character.peerage?.honoraryTitle) {
            return getMultiWordCapitalization(character.peerage.honoraryTitle) + " ";
        } else if (!character.peerage && primaryMembership?.rank) {
            if (character.memberships.length > 0) {
                let title = primaryMembership.rank.name;
                const priorityTitles = ["Supreme Ruler", "Executor", "Supreme Chancellor", "Praetor"];

                character.memberships.forEach((member) => {
                    if (!priorityTitles.includes(title)) {
                        if (member.rank && member.id !== primaryMembership.id && member.rank.name === "Praetor") {
                            title = member.rank.name;
                        }
                    }
                })

                return title + " ";
            }
            return primaryMembership.rank.name + " ";
        }
        return "";
    };

    const getPositionSignature = (member: CharacterMembership) => {
        const rank = member.rank;
        const position = member.position;
        const organization = member.organization;

        if (organization.name !== 'Throne') {
            if (organization.name === 'Imperial Republic' || organization.name === 'High Council' || organization.name === 'Praetorian Order') {
                if (position) {
                    return '<p>' + position.name + '</p>';
                } else if (rank) {
                    return '<p>' + rank.name + '</p>';
                }
            } else if (organization.type === 'BRANCH') {
                if (position) {
                    return '<p>' + position.name + '</p>';
                }
            }

            if (rank) {
                return '<p>' + rank.name + ' - <i>' + organization.name + '</i></p>';
            } else if (position) {
                return '<p>' + position.name + ' - <i>' + organization.name + '</i></p>';
            } else {
                return '<p><i>' + organization.name + '</i></p>';
            }
        }
        return '';
    };

    const getForceTitle = (forceProfile: CharacterForceProfile) => {
        const level = forceProfile.level;
        return forceProfile.order?.titles.find((title) => title.level === level) ?? null;
    };

    const getForceSignature = (forceProfile: CharacterForceProfile) => {
        const title = getForceTitle(forceProfile);
        if (title) return "<p>" + title.title + "</p>";
        return "";
    }

    const handleClaimNPC = async () => {
        if (!session?.user || claiming) return;
        
        setClaiming(true);
        try {
            await charactersApi.claimNPC(character.id);
            // Redirect back to characters page after claiming
            router.push('/characters');
        } catch (error) {
            console.error('Failed to claim NPC:', error);
        } finally {
            setClaiming(false);
        }
    }

    // Check if this character is an NPC (no approvalStatus means it's an NPC)
    const isNPC = !character.approvalStatus;
    const canClaimNPC = isNPC && session?.user && userHasAccess(roles[2], session.user); // STAFF level

    return (
        <>
            <h2 className={
                classNames(
                    character.status === "DECEASED" && 'text-red-600 dark:text-red-900 line-through',
                    character.status === "MISSING" && 'text-gray-500 line-through',
                    !(character.status === "DECEASED" || character.status === "MISSING") && 'text-gray-900 dark:text-white underline',
                    'font-bold text-center text-2xl'
                )
            }>
                {character.name}
            </h2>
            <h3 className="italic mb-3 text-center text-lg text-gray-600 dark:text-gray-300">{getProperCapitalization(character.status)}</h3>
            {character.avatarLink ? (
                <img
                    className="mx-auto size-40 flex-none bg-gray-50 dark:bg-gray-700"
                    src={character.avatarLink}
                    alt={character.name} />
            ) : (
                <span className="block mx-auto size-40 -mb-1.5 overflow-hidden bg-gray-50 dark:bg-gray-700">
                    <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                </span>
            )}

            {/* Claim NPC Button */}
            {canClaimNPC && (
                <div className="mt-4 mb-4 flex justify-center">
                    <button
                        onClick={handleClaimNPC}
                        disabled={claiming}
                        className={classNames(
                            claiming ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary-700',
                            'inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                        )}
                    >
                        {claiming ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Claiming...
                            </>
                        ) : (
                            'Claim NPC'
                        )}
                    </button>
                </div>
            )}

            <div className="mt-3 mb-7">
                <div className="grid grid-cols-1 sm:hidden">
                    <select value={tab} onChange={(e) => setTab(e.target.value as 'details' | 'positions' | 'signature' | 'force')}
                            aria-label="Select a tab"
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600">
                        <option value="details">Character Details</option>
                        <option value="positions">Current Positions</option>
                        <option value="signature">Forum Signature</option>
                        {(character.forceProfile && character.forceProfile.aware) && (
                            <option value="force">Force Profile</option>
                        )}
                    </select>
                    <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500" />
                </div>
                <div className="hidden sm:block">
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <nav className="-mb-px justify-center flex" aria-label="Tabs">
                            <a onClick={() => setTab('details')} className={classNames(tab !== 'details' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'details' && 'page'}>
                                Character Details
                            </a>
                            <a onClick={() => setTab('positions')} className={classNames(tab !== 'positions' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'positions' && 'page'}>
                                Current Position(s)
                            </a>
                            <a onClick={() => setTab('signature')} className={classNames(tab !== 'signature' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'signature' && 'page'}>
                                Forum Signature
                            </a>
                            {(character.forceProfile && character.forceProfile.aware) && (
                                <a onClick={() => setTab('force')} className={classNames(tab !== 'force' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'force' && 'page'}>
                                    Force Profile
                                </a>
                            )}
                        </nav>
                    </div>
                </div>
            </div>

            {tab === 'details' && (
                <div>
                    <div className="mt-3">
                        <dl className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Age</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.age ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div
                                className="border-t sm:border-none border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Gender</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {getProperCapitalization(character.gender)}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Race</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.species.name}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Homeworld</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.homeworld.name}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Appearance</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.appearance ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Habits</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.habits ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Strengths</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.strengths ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Weaknesses</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.weaknesses ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Hobbies</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.hobbies ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-1 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Talents</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.talents ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Interactions with Others</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0 px-4">
                                    {character.interactions.length >0 ? (
                                        <ul>
                                            {character.interactions.map((interaction) => (
                                                <li key={interaction.interaction} className="list-disc">
                                                    {interaction.interaction}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <em>None</em>
                                    )}
                                </dd>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Educational History</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0 px-4">
                                    {character.educationHistory.length >0 ? (
                                        <ul>
                                            {character.educationHistory.map((education) => (
                                                <li key={education.education} className="list-disc">
                                                    {education.education}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <em>None</em>
                                    )}
                                </dd>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Career History</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0 px-4">
                                    {character.previousPositions.length >0 ? (
                                        <ul>
                                            {character.previousPositions.map((position) => (
                                                <li key={position.position} className="list-disc">
                                                    {position.position}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <em>None</em>
                                    )}
                                </dd>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Awards & Honors</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0 px-4">
                                    {character.honors.length >0 ? (
                                        <ul>
                                            {character.honors.map((honor) => (
                                                <li key={honor.honor} className="list-disc">
                                                    {honor.honor}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <em>None</em>
                                    )}
                                </dd>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Goals & Ambitions</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0 px-4">
                                    {character.goals.length >0 ? (
                                        <ul>
                                            {character.goals.map((goal) => (
                                                <li key={goal.goal} className="list-disc">
                                                    {goal.goal}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <em>None</em>
                                    )}
                                </dd>
                            </div>
                            <div
                                className="border-t border-gray-100 dark:border-white/10 px-4 py-3 sm:col-span-2 sm:px-0">
                                <dt className="text-sm/6 flex items-center font-medium text-gray-900 dark:text-white">Background</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.background ?? (<em>Unknown</em>)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}

            {tab === 'positions' && (
                <>
                    {character.memberships.length > 0 && (
                        <div className="mt-3 mb-10">
                            <div className="max-w-7xl px-1">
                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                        <h1 className="text-base font-semibold text-gray-900 dark:text-white underline">Career</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flow-root overflow-hidden">
                                <div className="max-w-7xl">
                                    <table className="w-full text-left">
                                        <thead className="bg-white dark:bg-gray-900">
                                        <tr>
                                            <th scope="col"
                                                className="relative isolate py-3 pl-1 pr-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                                Rank
                                                <div
                                                    className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200 dark:border-b-gray-700"></div>
                                                <div
                                                    className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200 dark:border-b-gray-700"></div>
                                            </th>
                                            <th scope="col"
                                                className="hidden px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:table-cell">Position
                                            </th>
                                            <th scope="col"
                                                className="px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">Organization
                                            </th>
                                            <th scope="col"
                                                className="hidden px-3 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase sm:table-cell">Primary
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {character.memberships.map((member) => (
                                            <tr key={member.id}>
                                                <td className="relative py-4 pl-1 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                                                    {member.rank?.name ?? (<em>No Rank</em>)}
                                                    <div
                                                        className="absolute right-full bottom-0 h-px w-screen bg-gray-100 dark:bg-gray-800"></div>
                                                    <div
                                                        className="absolute bottom-0 left-0 h-px w-screen bg-gray-100 dark:bg-gray-800"></div>
                                                </td>
                                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                                    {member.position?.name ?? "N/a"}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    {member.organization.name}
                                                </td>
                                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                                    {member.primaryMembership && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                             fill="currentColor" className="size-6 text-green-500">
                                                            <path fillRule="evenodd"
                                                                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {character.peerage && (
                        <div className={classNames(character.memberships.length === 0 && 'mt-3')}>
                            <div className="max-w-7xl px-1">
                                <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                        <h1 className="text-base font-semibold text-gray-900 dark:text-white underline">Peerage</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 px-1">
                                <dl className="divide-y divide-gray-100 dark:divide-white/10">
                                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Manner of
                                            Address
                                        </dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                            {getMannerOfAddress(character.gender, character.peerage.peerageRank ?? undefined, character.peerage.honoraryTitle ?? undefined)}
                                        </dd>
                                    </div>
                                    {character.peerage?.peerageRank && (
                                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Peerage
                                                Title
                                            </dt>
                                            <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                                {getPeerageTitle(character.gender, character.peerage.peerageRank)}
                                            </dd>
                                        </div>
                                    )}
                                    {character.peerage?.honoraryTitle && (
                                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Honorary
                                                Title
                                            </dt>
                                            <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                                {getMultiWordCapitalization(character.peerage.honoraryTitle)}
                                            </dd>
                                        </div>
                                    )}
                                    {character.peerage?.peerageRank && (
                                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Domain</dt>
                                            <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                                The {getProperCapitalization(character.peerage.peerageRank)} of {character.peerage.domain!.name}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    )}
                </>
            )}

            {tab === 'signature' && (
                <>
                    <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                        <div className="px-4 py-5">
                            <p className="font-bold text-gray-900 dark:text-white">
                                {getSignatureTitle() + character.name}
                            </p>
                            {primaryMembership && (
                                <p className="text-gray-900 dark:text-white">
                                    <span dangerouslySetInnerHTML={{__html: getPositionSignature(primaryMembership)}}></span>
                                </p>
                            )}
                            {character.memberships.map((member) => (
                                <p key={member.id} className="text-gray-900 dark:text-white">
                                    <span dangerouslySetInnerHTML={{__html: primaryMembership?.id !== member.id ? getPositionSignature(member) : ""}}></span>
                                </p>
                            ))}
                            {(character.forceProfile && character.forceProfile.aware) && (
                                <p className="text-gray-900 dark:text-white">
                                    <span dangerouslySetInnerHTML={{__html: getForceSignature(character.forceProfile)}}></span>
                                </p>
                            )}
                            {(character.peerage && character.peerage.peerageRank) && (
                                <p className="text-gray-900 dark:text-white">
                                    {character.gender === "MALE" ? "Lord" : "Lady"} Stewart of the {character.peerage.peerageRank === "KINGDOM_HEIR" ? "Kingdom" : getProperCapitalization(character.peerage.peerageRank)} of {character.peerage.domain?.name ?? "Unknown"}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-gray-200/40 dark:bg-gray-700/40 shadow-sm">
                        <div className="px-4 py-5">
                            <p className="ext-gray-900 dark:text-white">
                                &lt;p&gt;&lt;b&gt;{getSignatureTitle() + character.name}&lt;/b&gt;&lt;/p&gt;
                            </p>
                            {primaryMembership && (
                                <p className="text-gray-900 dark:text-white">
                                    {getPositionSignature(primaryMembership)}
                                </p>
                            )}
                            {character.memberships.map((member) => (
                                <p key={member.id} className="text-gray-900 dark:text-white">
                                    {primaryMembership?.id !== member.id && getPositionSignature(member)}
                                </p>
                            ))}
                            {(character.forceProfile && character.forceProfile.aware) && (
                                <p className="text-gray-900 dark:text-white">
                                    {getForceSignature(character.forceProfile)}
                                </p>
                            )}
                            {(character.peerage && character.peerage.peerageRank) && (
                                <p className="text-gray-900 dark:text-white">
                                    &lt;p&gt;{character.gender === "MALE" ? "Lord" : "Lady"} Stewart of the {character.peerage.peerageRank === "KINGDOM_HEIR" ? "Kingdom" : getProperCapitalization(character.peerage.peerageRank)} of {character.peerage.domain?.name ?? "Unknown"}&lt;/p&gt;
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}

            {(tab === 'force' && character.forceProfile) && (
                <div>
                    <div className="mt-3">
                        <dl className="divide-y divide-gray-100 dark:divide-white/10">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Force Level</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {getProperCapitalization(character.forceProfile.level)}{character.forceProfile.level != "POTENTIAL" ? "-Level" : ""} {getForceTitle(character.forceProfile) && (<span>&#40;<em>{getForceTitle(character.forceProfile)!.title}</em>&#41;</span>)}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Force Alignment</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.forceProfile.alignment ? getProperCapitalization(character.forceProfile.alignment) : (
                                        <em>N/a</em>)}
                                </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Force Order</dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                                    {character.forceProfile.order?.name ?? (<em>None</em>)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}
        </>
    );
}