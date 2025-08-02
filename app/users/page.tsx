'use client'

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { roles, userHasAccess } from '@/lib/roles';
import { usersApi } from '@/lib/apiClient';
import { classNames, getMultiWordCapitalization } from '@/lib/style';
import Pagination from '@/components/Pagination';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface User {
    id: string;
    name: string | null;
    username: string;
    email: string;
    role: string;
    image: string | null;
    nexusId: bigint;
    createdAt: string;
    updatedAt: string;
    _count: {
        characters: number;
    };
}

export default function UsersHome() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [updatingRole, setUpdatingRole] = useState<string | null>(null);
    
    const { data: session, status } = useSession();
    const isAdmin = session?.user && userHasAccess(roles[5], session.user); // ADMIN level

    const loadUsers = async () => {
        if (!isAdmin) return;
        
        setLoading(true);
        try {
            const response = await usersApi.getAllUsers(page, search, roleFilter);
            const { users, totalPages: pages, totalCount: count } = response.data;
            setUsers(users);
            setTotalPages(pages);
            setTotalCount(count);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        setUpdatingRole(userId);
        try {
            await usersApi.updateUserRole(userId, newRole);
            await loadUsers(); // Reload users to see the change
        } catch (error) {
            console.error('Failed to update user role:', error);
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleSearch = () => {
        setPage(0);
        loadUsers();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (isAdmin) {
            loadUsers();
        }
    }, [page, isAdmin]);

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'SYSTEM_ADMIN':
                return 'bg-purple-100 text-purple-800 ring-purple-600/20';
            case 'ADMIN':
                return 'bg-indigo-100 text-indigo-800 ring-indigo-600/20';
            case 'ASSISTANT_ADMIN':
                return 'bg-blue-100 text-blue-800 ring-blue-600/20';
            case 'GAME_MODERATOR':
                return 'bg-green-100 text-green-800 ring-green-600/20';
            case 'STAFF':
                return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
            case 'PLAYER':
                return 'bg-gray-100 text-gray-800 ring-gray-600/20';
            case 'BANNED':
                return 'bg-red-100 text-red-800 ring-red-600/20';
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (status === 'unauthenticated' || !isAdmin) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">You don&apos;t have permission to access user management.</p>
            </div>
        );
    }

    return (
        <div className="mt-5 px-4 sm:px-6 lg:px-8">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl/7 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MagnifyingGlassIcon className="h-7 w-7 text-gray-400" />
                            User Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage user accounts and roles. Total: {totalCount} users
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search users..."
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                >
                    <option value="">All Roles</option>
                    {roles.slice().reverse().map(role => (
                        <option key={role} value={role}>{getMultiWordCapitalization(role)}</option>
                    ))}
                </select>
                <button
                    onClick={handleSearch}
                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                    <MagnifyingGlassIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Search
                </button>
            </div>

            {/* Users Table */}
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:pl-6">
                                            User
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Role
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Characters
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            Joined
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                    {loading ? (
                                        [...Array(10)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                        <div className="ml-4">
                                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6">
                                                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                    <div className="flex items-center">
                                                        {user.image ? (
                                                            <img className="h-10 w-10 rounded-full" src={user.image} alt={user.name || user.username} />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    {(user.name || user.username).charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {user.name || user.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                        disabled={updatingRole === user.id || user.id === session?.user?.id}
                                                        className={classNames(
                                                            getRoleBadgeColor(user.role),
                                                            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset border-0'
                                                        )}
                                                    >
                                                        {roles.slice().reverse().map(role => (
                                                            <option key={role} value={role}>{getMultiWordCapitalization(role)}</option>
                                                        ))}
                                                    </select>
                                                    {updatingRole === user.id && (
                                                        <svg className="animate-spin ml-2 h-4 w-4 text-gray-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {user._count.characters}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    {/*<a
                                                        href={`/users/${user.id}`}
                                                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                                    >
                                                        View<span className="sr-only">, {user.name || user.username}</span>
                                                    </a>*/}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}