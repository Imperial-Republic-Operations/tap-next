'use client'

import { useEffect, useState } from "react";
import { Month } from "@/lib/generated/prisma";
import { classNames, getProperCapitalization } from "@/lib/style";
import { fetchMonths, updateMonth } from "@/lib/_calendar";
import { useForm } from "react-hook-form";

export default function MonthsList({ admin }: { admin: boolean}) {
    const [showModal, setShowModal] = useState(false);
    const [months, setMonths] = useState<Month[]>([]);
    const [editMonth, setEditMonth] = useState<Month | null>(null);

    const {register, handleSubmit, formState: {errors, touchedFields, isValid}} = useForm({
        defaultValues: {
            gameMonth: editMonth?.gameMonth ?? '',
        },
    });

    const openModal = (month: Month) => {
        setEditMonth(month);
        setShowModal(true);
    };

    const closeModal = () => {
        setEditMonth(null);
        setShowModal(false);
    };

    const refreshList = () => {
        loadMonths();
        closeModal();
    }

    const loadMonths = async() => {
        const recordedMonths = await fetchMonths();
        setMonths(recordedMonths);
    }

    const handleSubmitMonth = async (data: {
        gameMonth: string;
    }) => {
        try {
            console.log(data);
            // updateMonth(editMonth!.realMonth, data.gameMonth);
            // refreshList();
        } catch (e) {
            console.error('Error updating IR month', e);
        }
    }

    useEffect(() => {
        loadMonths();
    }, []);

    return(
        <div>
            <div className="pt-2 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl/7 font-semibold text-gray-900 dark:text-white">Months of the Imperial
                            Republic</h1>
                    </div>
                </div>
                <div hidden={!showModal || !editMonth} className={classNames(showModal && editMonth ? 'z-1000' : '-z-10', 'relative')} aria-labelledby="modal-title">
                    <div className={classNames(showModal && editMonth ? 'ease-out duration-300 opacity-100 transition-opacity' : 'ease-in duration-200 opacity-0 transition-opacity', 'fixed inset-0 bg-gray-500/75 dark:bg-gray-950/75')} aria-hidden="true">
                    </div>

                    <div className={classNames(showModal && editMonth ? 'z-1000' : '-z-10', 'fixed inset-0 w-screen overflow-y-auto')}>
                        <form onSubmit={handleSubmit(handleSubmitMonth)}>
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <div className={classNames(showModal && editMonth ? 'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100' : 'ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', 'relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6')}>
                                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                                        <button onClick={() => closeModal()} type="button" className="rounded-md bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-600 hover:text-gray-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-hidden">
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
                                            <h3 id="modal-title" className="text-base font-semibold text-gray-900 dark:text-white">Editing {`${editMonth?.realMonth.substring(0, 1)}${editMonth?.realMonth.substring(1).toLowerCase()}`}</h3>
                                            <div className="mt-2">
                                                <div className="mt-10 mb-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                    <div className="sm:col-span-4">
                                                        <label htmlFor="gameMonth" className="block text-sm/6 font-medium text-gray-900 dark:text-white">Month</label>
                                                        <div className="mt-2">
                                                            <div
                                                                className={classNames(touchedFields.gameMonth && errors.gameMonth ? 'outline-red-300 focus-within:outline-red-600' : 'outline-gray-300 focus-within:outline-primary-600', 'flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2')}>
                                                                <input type="text"
                                                                       {...register('gameMonth', { required: true })}
                                                                       name="gameMonth"
                                                                       id="gameMonth"
                                                                       className="block w-full grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                                       placeholder="0"
                                                                       aria-describedby={touchedFields.gameMonth && errors.gameMonth ? 'input-error' : undefined} />
                                                                {(touchedFields.gameMonth && errors.gameMonth) && (
                                                                    <svg className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
                                                                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            {(touchedFields.gameMonth && errors.gameMonth) && (<em className="text-red-500">Please provide a name for the month.</em>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button type="submit" disabled={!isValid} className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto">Create</button>
                                        <button type="button" onClick={() => closeModal()} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead>
                                <tr>
                                    <th scope="col"
                                        className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0 dark:text-white">Real
                                        Month
                                    </th>
                                    <th scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">In-Game
                                        Month
                                    </th>
                                    <th scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Last
                                        Updated
                                    </th>
                                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {months.map((month) => (
                                    <tr key={month.realMonth}>
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0 dark:text-white">{getProperCapitalization(month.realMonth)}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">{month.gameMonth}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {new Date(month.updatedAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                                            {admin && (
                                                <a onClick={() => openModal(month)}
                                                   className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Edit<span
                                                    className="sr-only"> {month.gameMonth}</span></a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}