'use client'

import { useEffect, useState } from "react";
import { Era, Year } from "@/lib/generated/prisma";
import { createYear, fetchYears, makeYearCurrent } from "@/lib/_calendar";
import Pagination from "@/components/Pagination";
import { classNames } from "@/lib/style";
import { FormProvider, useForm } from "react-hook-form";
import Toggle from "@/components/Toggle";

export default function YearList({ admin, moderator }: { admin: boolean, moderator: boolean }) {
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState<Era | 'ALL'>('ALL');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [years, setYears] = useState<Year[]>([]);

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            gameYear: 0,
            era: 'IRY',
            current: false,
        },
    });

    const {register, handleSubmit, formState: {errors, touchedFields, isValid}} = methods;

    const changeFilter = (filter: Era | 'ALL') => {
        setFilter(filter);
        setPage(0);
    };

    const refreshList = () => {
        changeFilter('ALL');
        loadYears(filter, page);
        setShowModal(false);
    };

    const makeCurrentYear = async (yearId: bigint) => {
        try {
            await makeYearCurrent(yearId);
            refreshList();
        } catch (e) {
            console.error('Error updating current IR year', e);
        }
    }

    const loadYears = async (filter: Era | 'ALL', pageNumber: number) => {
        const {years, totalPages} = filter === 'ALL' ? await fetchYears(pageNumber) : await fetchYears(pageNumber, filter);
        setYears(years);
        setTotalPages(totalPages);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadYears(filter, newPage);
    };

    const handleSubmitYear = async (data: {
        gameYear: number;
        era: string;
        current: boolean;
    }) => {
        try {
            await createYear(data);
            refreshList();
        } catch (e) {
            console.error('Error creating IR year', e);
        }
    }

    useEffect(() => {
        loadYears(filter, page);
    }, [filter, page]);

    return (
        <div>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl/7 font-semibold text-gray-900 dark:text-white">Years of the Imperial Republic</h1>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button onClick={() => setShowModal(true)} disabled={!admin} type="button" className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">Create New Year</button>

                        <div hidden={!showModal} className={classNames(showModal ? 'z-1000' : '-z-10', 'relative')} aria-labelledby="modal-title">
                            <div className={classNames(showModal ? 'ease-out duration-300 opacity-100 transition-opacity' : 'ease-in duration-200 opacity-0 transition-opacity', 'fixed inset-0 bg-gray-500/75 dark:bg-gray-950/75')} aria-hidden="true">
                            </div>

                            <div className={classNames(showModal ? 'z-1000' : '-z-10', 'fixed inset-0 w-screen overflow-y-auto')}>
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(handleSubmitYear)}>
                                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                            <div className={classNames(showModal ? 'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100' : 'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', 'relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6')}>
                                                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                                    <button onClick={() => setShowModal(false)} type="button" className="rounded-md bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 hover:text-gray-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-hidden">
                                                        <span className="sr-only">Close</span>
                                                        <svg className="size-6" fill="none" viewBox="0 0 24 24"
                                                             strokeWidth="1.5" stroke="currentColor" aria-hidden="true"
                                                             data-slot="icon">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M6 16 16 6M6 6l12 12"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <h3 id="modal-title" className="text-base font-semibold text-gray-900 dark:text-white">New Year Record</h3>
                                                        <div className="mt-2">
                                                            <div className="mt-10 mb-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                                <div className="sm:col-span-4">
                                                                    <label htmlFor="gameYear" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Year</label>
                                                                    <div className="my-2">
                                                                        <div
                                                                            className={classNames(touchedFields.gameYear && errors.gameYear ? 'outline-red-300 focus-within:outline-red-600' : 'outline-gray-300 focus-within:outline-primary-600', 'flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2')}>
                                                                            <input type="number"
                                                                                   min={0}
                                                                                   {...register('gameYear', { valueAsNumber: true, required: true, min: 0 })}
                                                                                   name="gameYear"
                                                                                   id="gameYear"
                                                                                   className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                                                   placeholder="0"
                                                                                   aria-describedby={touchedFields.gameYear && errors.gameYear ? 'input-error' : undefined} />
                                                                            {(touchedFields.gameYear && errors.gameYear) && (
                                                                                <svg className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                                                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                                                                                </svg>
                                                                            )}
                                                                            <div
                                                                                className="grid shrink-0 grid-cols-1 focus-within:relative">
                                                                                <select id="era" {...register('era', { required: true })} name="era" aria-label="Era" className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6">
                                                                                    <option value="IRY">IRY</option>
                                                                                    <option value="UFY">UFY</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        {(touchedFields.gameYear && errors.gameYear) && (<em className="text-red-500">Please provide a year number.</em>)}
                                                                    </div>
                                                                    <Toggle name="current" />
                                                                    <label htmlFor="current" className="ml-3 inline-block text-sm/6 font-medium text-gray-900 dark:text-white">Current</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                    <button type="submit" disabled={!isValid} className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto">Create</button>
                                                    <button type="button" onClick={() => setShowModal(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </FormProvider>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-10 my-5">
                    <button onClick={() => changeFilter('ALL')} type="button" className="block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">All</button>
                    <button onClick={() => changeFilter('IRY')} type="button" className="block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">IRY</button>
                    <button onClick={() => changeFilter('UFY')} type="button" className="block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">UFY</button>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0 dark:text-white">Year</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Creation Date</th>
                                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                        <span className="sr-only">Make Current</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {years.map((year) => (
                                    <tr key={year.id}>
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0 dark:text-white">
                                            {year.gameYear} {year.era}
                                            {year.current && (<span title="Current In-Game Year" data-tooltip="current" className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>)}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {new Date(year.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                            {(!year.current && moderator) && (
                                                <a onClick={() => makeCurrentYear(year.id)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Make<span className="sr-only"> {year.gameYear} {year.era}</span> Current</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}