'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usersApi } from '@/lib/apiClient';
import { UserCircleIcon, CalendarIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getMultiWordCapitalization } from "@/lib/style";

interface UserProfile {
    id: string;
    name: string | null;
    username: string;
    email: string;
    nexusId: string;
    role: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    characterCount: number;
    activeCharacterCount: number;
    pendingCharacterCount: number;
    settings?: {
        language: string;
        dateFormat: string;
        timeFormat: string;
        emailNotifications: boolean;
    };
    characters: Array<{
        id: string;
        name: string;
        approvalStatus: string;
        status: string;
    }>;
}

export default function UserProfile() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const response = await usersApi.getUserProfile(session.user.id);
                setProfile(response.data);
            } catch (err: any) {
                setError('Failed to load profile');
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [session?.user?.id]);

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="p-6">
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error || 'Failed to load profile'}</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Manage your account information and preferences.
                </p>
            </div>

            <div className="space-y-6">
                {/* User Information Card */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            User Information
                        </h3>
                    </div>
                    <div className="px-6 py-5">
                        <div className="flex items-center space-x-4 mb-6">
                            {profile.image ? (
                                <img
                                    className="h-16 w-16 rounded-full object-cover"
                                    src={profile.image}
                                    alt={profile.name || profile.username}
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {profile.name || profile.username}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getMultiWordCapitalization(profile.role)}
                                </p>
                            </div>
                        </div>

                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nexus Profile</dt>
                                <dd className="mt-1 text-sm">
                                    <a 
                                        href={`${process.env.NEXT_PUBLIC_NEXUS_URL}/profile/${profile.nexusId}-${profile.username.toLowerCase().replace(/\s+/g, '-')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                    >
                                        View Nexus Profile
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                                    {formatDate(profile.createdAt)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Character Statistics */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            Character Statistics
                        </h3>
                    </div>
                    <div className="px-6 py-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <ChartBarIcon className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    Total Characters
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {profile.characterCount}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                                                <div className="h-2 w-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    Active Characters
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {profile.activeCharacterCount}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                                <div className="h-2 w-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                                    Pending Approval
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {profile.pendingCharacterCount}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Character List */}
                        {profile.characters.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Characters</h4>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {profile.characters.map((character) => (
                                        <Link
                                            key={character.id}
                                            href={`/characters/${character.id}`}
                                            className="block p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {character.name}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    character.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : character.approvalStatus === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {character.status === 'ACTIVE' ? 'Active' : 
                                                     character.approvalStatus === 'PENDING' ? 'Pending' :
                                                     character.status}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Settings Preview */}
                {profile.settings && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                Settings
                            </h3>
                            <Link
                                href="/settings"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <CogIcon className="h-4 w-4 mr-2" />
                                Edit Settings
                            </Link>
                        </div>
                        <div className="px-6 py-5">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.settings.language.toUpperCase()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Format</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{profile.settings.dateFormat}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Format</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {profile.settings.timeFormat === 'TWENTY_FOUR' ? '24 Hour' : '12 Hour'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Notifications</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {profile.settings.emailNotifications ? 'Enabled' : 'Disabled'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}