'use client'

import { useEffect, useState } from "react";
import { Organization } from "@/lib/generated/prisma";
import Cookies from "js-cookie";
import {
    DocumentForList,
    fetchGameDocuments,
    fetchOrganizationDocuments,
    fetchPersonalDocuments
} from "@/lib/_documents";
import { CharacterDetails, fetchCharacter } from "@/lib/_characters";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { classNames, getProperCapitalization } from "@/lib/style";
import Pagination from "@/components/Pagination";

export default function DocumentTab({ status, admin }: { status: 'authenticated' | 'unauthenticated', admin: boolean }) {
    const [tab, setTab] = useState<'game' | 'organization' | 'personal'>('game');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [documents, setDocuments] = useState<DocumentForList[]>([]);

    const syncActiveCharacterId = () => {
        const id = Cookies.get('activeCharacterId');
        setActiveCharacterId(id || null);
    };

    const getCodifiedId = (document: DocumentForList) => {
        if ('teamId' in document) {
            return `${document.team.abbreviation}-${document.sequenceNumber}`;
        } else if ('organizationId' in document) {
            if (document.type.useOrganization) {
                return `${document.type.abbreviation}-${document.organization.abbreviation}-${document.sequenceNumber}`;
            } else {
                return `${document.type.abbreviation}-${document.sequenceNumber}`;
            }
        } else {
            const initials = document.author.name.split(' ').map(n => n[0]).join('');
            return `JRNL-${initials}-${document.sequenceNumber}`;
        }
    };

    useEffect(() => {
        // Initial load
        syncActiveCharacterId();

        // Listen for character change
        window.addEventListener('activeCharacterChanged', syncActiveCharacterId);

        return () => {
            window.removeEventListener('activeCharacterChanged', syncActiveCharacterId);
        };
    }, []);

    useEffect(() => {
        if (!activeCharacterId) return;
        const load = async () => {
            const character: CharacterDetails = (await fetchCharacter(BigInt(activeCharacterId)))!;
            const memberships = character.memberships;

            const orgs = memberships.map(m => m.organization);
            const primaryOrg = memberships.find(m => m.primaryMembership)?.organization;
            setOrganizations(orgs);
            setSelectedOrganization(primaryOrg ?? orgs[0] ?? null);
        };

        load();
    }, [activeCharacterId]);

    const goToTab = (tab: 'game' | 'organization' | 'personal') => {
        setTab(tab);
        setPage(0);
    };

    const loadDocuments = async (tabName: 'game' | 'organization' | 'personal', pageNumber: number) => {
        switch (tabName) {
            case 'game':
                const {documents, totalPages} = await fetchGameDocuments(pageNumber) ;
                setDocuments(documents);
                setTotalPages(totalPages);
                break;
            case 'organization':
                if (activeCharacterId && selectedOrganization) {
                    const {documents, totalPages} = await fetchOrganizationDocuments(BigInt(activeCharacterId), selectedOrganization.id, pageNumber);
                    setDocuments(documents);
                    setTotalPages(totalPages);
                } else {
                    setDocuments([]);
                    setTotalPages(1);
                }
                break;
            case 'personal':
                if (activeCharacterId) {
                    const {documents, totalPages} = await fetchPersonalDocuments(BigInt(activeCharacterId), pageNumber);
                    setDocuments(documents);
                    setTotalPages(totalPages);
                } else {
                    setDocuments([]);
                    setTotalPages(1);
                }
                break;
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadDocuments(tab, newPage);
    }

    useEffect(() => {
        loadDocuments(tab, page);
    }, [tab, page]);

    return (
        <>
            {(status === 'authenticated' && activeCharacterId) && (
                <div className="mb-7">
                    <div className="grid grid-cols-1 sm:hidden">
                        <select value={tab} onChange={(e) => goToTab(e.target.value as 'game' | 'organization' | 'personal')} aria-label="Select a tab" className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600">
                            <option value="game">Game Documents</option>
                            <option value="organization">Organization Documents</option>
                            <option value="personal">Personal Documents</option>
                        </select>
                        <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500" />
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200 dark:border-gray-800">
                            <nav className="-mb-px justify-center flex" aria-label="Tabs">
                                <a onClick={() => goToTab('game')} className={classNames(tab !== 'game' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'game' && 'page'}>
                                    Game Documents
                                </a>
                                <a onClick={() => goToTab('organization')} className={classNames(tab !== 'organization' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'organization' && 'page'}>
                                    Organization Documents
                                </a>
                                <a onClick={() => goToTab('personal')} className={classNames(tab !== 'personal' ? 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:border-gray-700 dark:hover:text-gray-300' : 'border-primary-500 text-primary-600 dark:text-primary-400', 'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium')} aria-current={tab === 'personal' && 'page'}>
                                    Personal Documents
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/*  TODO: Create buttons for Organization filtering  */}

            <div className="px-4 sm:px-6 lg:px-8 mb-5">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                            {getProperCapitalization(tab)} Documents
                        </h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            {
                                tab === 'personal'
                                    ? "A list of personal notes and documents."
                                    : tab === 'game'
                                        ? "A list of documents related to EOTIR related rulings."
                                        : "A list of documents related to specific organization organization."
                            }
                        </p>
                    </div>
                    {((tab === 'game' && admin) || (tab == 'personal' && activeCharacterId)) && (
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button type="button" className="block rounded-md bg-primary-600 dark:bg-primary-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary-500 dark:hover:bg-primary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-500">Add Document</button>
                        </div>
                    )}
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">Document ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Author</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                    {((tab === 'game' && admin) || (tab == 'personal' && activeCharacterId)) && (
                                        <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    )}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {documents.map((document) => (
                                    <tr className="even:bg-gray-50 dark:even:bg-gray-950">
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white sm:pl-0">
                                            <a href={`/documents/view/${tab}/${document.id}`}>
                                                {getCodifiedId(document)}
                                            </a>
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {document.title}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {document.author.name}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {new Date(document.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {getProperCapitalization(document.status)}
                                        </td>
                                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                            <a href={`/documents/edit/${tab}/${document.id}`} className="text-primary-600 hover:text-primary-900">
                                                Edit<span className="sr-only">, {getCodifiedId(document)}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
    );
}