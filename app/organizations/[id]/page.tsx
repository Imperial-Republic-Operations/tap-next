import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchOrganization, fetchOrganizationParents, OrganizationDetailsWithChildren } from "@/lib/_organizations";
import { cookies } from "next/headers";
import { roles, userHasAccess } from "@/lib/roles";
import MembersList from "@/app/organizations/[id]/_components/MembersList";

export default async function ViewOrganization({params}: {params: Promise<{id: string}>}) {
    const getID = (value: string): bigint => {
        const id = BigInt(value);
        if (!id) {
            redirect('/characters');
        }
        return id;
    }

    const getType = (org: OrganizationDetailsWithChildren): string => {
        return org.type.substring(0, 1) + org.type.substring(1).toLowerCase();
    }

    const id = getID((await params).id);
    const session = await auth();
    const organization = await fetchOrganization(id);

    const leader = organization?.members.find(
        (member) => member.position?.accessType === 'ORGANIZATION_LEADER'
    );

    const seconds = organization?.members.filter(
        (member) => member.position?.accessType === 'ORGANIZATION_2IC'
    );

    const admins = organization?.members.filter(
        (member) => member.position?.accessType === 'ORGANIZATION_ADMIN'
    );


    const cookieStore = await cookies();
    const activeCharacterId = cookieStore.get("activeCharacterId")?.value;

    if (!organization) redirect('/organizations');

    const canViewMembers = async (
        user: any,
        activeCharacterId: string | undefined,
        organization: OrganizationDetailsWithChildren,
    ): Promise<boolean> => {
        if (!activeCharacterId) return false;

        const members = organization.members;

        if (user && userHasAccess(roles[5], user)) return true;

        const isOrgAdmin = members.some(
            (member) =>
                member.character.id.toString() === activeCharacterId &&
                (member.position?.permissions.includes('LEADER')
                    || member.position?.permissions.includes('MANAGE_MEMBERS'))
        );

        if (isOrgAdmin) return true;

        try {
            const parents = await fetchOrganizationParents(organization.id);

            const results = await Promise.all(
                parents.map(async (parent) => {
                    return parent.members.some(
                        (member) =>
                            member.character.id.toString() === activeCharacterId &&
                            (member.position?.accessType === 'ORGANIZATION_LEADER'
                                || member.position?.accessType === 'ORGANIZATION_2IC'
                                || member.position?.accessType === 'ORGANIZATION_ADMIN')
                    );
                })
            );

            return results.includes(true);
        } catch (err) {
            console.error("Failed to get org parents or memberships:", err);
            return false;
        }
    };

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
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Leader</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                <p>{leader ? `${leader.rank?.name} ${leader.character.name}` : 'N/a' }</p>
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Second(s) in Command</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                {(seconds && seconds.length > 0) ? seconds.map((second) => (
                                    <p key={second.id}>{`${second.rank?.name} ${second.character.name}`}</p>
                                )) : (<p>N/a</p>) }
                            </dd>
                        </div>
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Administrator(s)</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                {(admins && admins.length > 0) ? admins.map((admin) => (
                                    <p key={admin.id}>{`${admin.rank?.name} ${admin.character.name}`}</p>
                                )) : (<p>N/a</p>) }
                            </dd>
                        </div>
                        {(organization.type !== 'FACTION' && organization.parent) && (
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm/6 font-medium text-gray-900 dark:text-white">Parent
                                    Organization
                                </dt>
                                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                                    <p>
                                        <a href={`/organizations/${organization.parent.id}`}>{organization.parent.name}</a>
                                    </p>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>

            {organization.children.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-medium text-gray-500">Suborganizations</h2>
                    <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        {organization.children.map((sub) => (
                            <li key={sub.id} className="col-span-1 flex rounded-md shadow-xs">
                                <div
                                    className="flex w-16 shrink-0 items-center justify-center rounded-l-md bg-violet-600 text-sm font-medium text-white">{sub.abbreviation.substring(0, 5)}</div>
                                <div
                                    className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                    <div className="flex-1 truncate px-4 py-2 text-sm">
                                        <a href={`/organizations/${sub.id}`}
                                           className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">{sub.name}</a>
                                        <p className="text-gray-500">{sub.members.length} Member{sub.members.length !== 1 ? "s" : ""}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {await canViewMembers(session?.user, activeCharacterId, organization) && (
                <MembersList orgId={organization.id} />
            )}
        </>
    );
}