'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OrganizationWithTotalMembers } from "@/lib/types";
import { organizationsApi } from "@/lib/apiClient";
import { roles, userHasAccess } from "@/lib/roles";
import MembersList from "@/app/organizations/[id]/_components/MembersList";
import { $Enums } from "@/lib/generated/prisma";
import { User } from "next-auth";
import SuborganizationsList from "@/app/organizations/[id]/_components/SuborganizationsList";
import Cookies from "js-cookie";

interface MemberBreakdown {
    totalUniqueCharacters: number;
    totalMemberships: number;
    organizationIds: bigint[];
}

export default function ViewOrganization({params}: {params: Promise<{id: string}>}) {
    const router = useRouter();
    const { data: session } = useSession();
    const [organization, setOrganization] = useState<OrganizationWithTotalMembers | null>(null);
    const [memberBreakdown, setMemberBreakdown] = useState<MemberBreakdown | null>(null);
    const [loading, setLoading] = useState(true);
    const [canViewMembersList, setCanViewMembersList] = useState(false);
    const [resolvedParams, setResolvedParams] = useState<{id: string} | null>(null);

    // Resolve params
    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    const getID = (value: string): bigint => {
        const id = BigInt(value);
        if (!id) {
            router.push('/organizations');
            return BigInt(0);
        }
        return id;
    }

    const getType = (org: OrganizationWithTotalMembers): string => {
        return org.type.substring(0, 1) + org.type.substring(1).toLowerCase();
    }

    const canViewMembers = async (
        user: ({id: string, role: $Enums.Role, nexusId?: string} & User) | undefined,
        activeCharacterId: string | undefined,
        organization: OrganizationWithTotalMembers,
    ): Promise<boolean> => {
        if (user && userHasAccess(roles[5], user)) {
            console.log('User has access', user);
            return true;
        }

        if (!activeCharacterId) return false;

        const members = organization.members;

        const isOrgAdmin = members.some(
            (member: any) =>
                member.character.id.toString() === activeCharacterId &&
                (member.position?.permissions?.some((p: any) => p.value === 'LEADER')
                    || member.position?.permissions?.some((p: any) => p.value === 'MANAGE_MEMBERS'))
        );

        if (isOrgAdmin) return true;

        try {
            const response = await organizationsApi.getOrganizationParents(organization.id);
            const parents = response.data;

            const results = parents.map((parent: any) => {
                return parent.members.some(
                    (member: any) =>
                        member.character.id.toString() === activeCharacterId &&
                        (member.position?.permissions?.some((p: any) => p.value === 'LEADER')
                            || member.position?.permissions?.some((p: any) => p.value === 'MANAGE_MEMBERS'))
                );
            });

            return results.includes(true);
        } catch (err) {
            console.error("Failed to get org parents or memberships:", err);
            return false;
        }
    };

    useEffect(() => {
        if (!resolvedParams) return;

        const fetchOrganizationData = async () => {
            try {
                const id = getID(resolvedParams.id);
                if (id === BigInt(0)) return;

                // Fetch organization data and member breakdown in parallel
                const [orgResponse, breakdownResponse] = await Promise.all([
                    organizationsApi.getOrganizationWithTotalMembers(id),
                    organizationsApi.getOrganizationMemberBreakdown(id)
                ]);

                const org = orgResponse.data;
                const breakdown = breakdownResponse.data;

                if (!org) {
                    router.push('/organizations');
                    return;
                }

                setOrganization(org);
                setMemberBreakdown(breakdown);

                // Check if user can view members
                const activeCharacterId = Cookies.get("activeCharacterId");
                const canView = await canViewMembers(session?.user, activeCharacterId, org);
                setCanViewMembersList(canView);

            } catch (error) {
                console.error('Error fetching organization data:', error);
                router.push('/organizations');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizationData();
    }, [resolvedParams, session, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!organization || !memberBreakdown) {
        return null;
    }

    const leader = organization?.members.find(
        (member) => member.position?.permissions.some((p) => p.value === 'LEADER')
    );

    const seconds = organization?.members.filter(
        (member) => member.position?.permissions.some((p) => p.value === 'SECOND_IN_COMMAND')
    );

    const leadership = organization?.members.filter(
        (member) => member.position?.permissions.some((p) => p.value === 'LEADERSHIP')
    );

    return (
        <>
            <div className="border-b border-gray-200 pb-3 mb-3 dark:border-gray-700">
                <h2 className="text-2xl/7 font-semibold">{organization.name}</h2>
            </div>

            <div className="mb-3">
                <div className="px-4 sm:px-0">
                    <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">{getType(organization)} Leadership</h3>
                </div>
                <div className="mt-4 border-t border-gray-100 dark:border-white/10">
                    <dl className="divide-y divide-gray-100 dark:divide-white/10">
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Leader</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                <p>{leader ? `${leader.rank?.name ?? ''} ${leader.character.name}` : 'N/a' }</p>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Second(s) in Command</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                {(seconds && seconds.length > 0) ? seconds.map((second) => (
                                    <p key={second.id.toString()}>{`${second.rank?.name ?? ''} ${second.character.name}`}</p>
                                )) : (<p>N/a</p>) }
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Leadership</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                {(leadership && leadership.length > 0) ? leadership.map((admin) => (
                                    <p key={admin.id.toString()}>{`${admin.rank?.name ?? ''} ${admin.character.name}`}</p>
                                )) : (<p>N/a</p>) }
                            </dd>
                        </div>
                        {(organization.type !== 'FACTION' && organization.parent) && (
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Parent
                                    Organization
                                </dt>
                                <dd className="mt-1 text-sm/6 text-gray-600 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                    <p>
                                        <a href={`/organizations/${organization.parent.id}`} className="underline hover:text-gray-800 dark:hover:text-gray-200">{organization.parent.name}</a>
                                    </p>
                                </dd>
                            </div>
                        )}
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Membership Statistics</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                <div className="space-y-1">
                                    <p>Total Unique Members: <span className="font-medium">{memberBreakdown.totalUniqueCharacters}</span></p>
                                    <p>Total Memberships: <span className="font-medium">{memberBreakdown.totalMemberships}</span></p>
                                    <p>Direct Members: <span className="font-medium">{organization.members.length}</span></p>
                                    {memberBreakdown.organizationIds.length > 1 && (
                                        <p className="text-xs text-gray-500">
                                            Includes {memberBreakdown.organizationIds.length - 1} suborganization{memberBreakdown.organizationIds.length === 2 ? '' : 's'}
                                        </p>
                                    )}
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {organization.children.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-medium text-gray-500">Suborganizations</h2>
                    <SuborganizationsList subOrgs={organization.children} />
                </div>
            )}

            {canViewMembersList && (
                <MembersList orgId={organization.id} />
            )}
        </>
    );
}