import { auth } from "@/auth";
import { userHasAccess } from "@/lib/roles";
import SidebarLink from "@/components/SidebarLink";
import { prisma } from "@/lib/prisma";
import { Team } from "@/lib/generated/prisma";

export default async function Sidebar({navigation}: {navigation: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[]}) {
    const session = await auth();
    const status: "authenticated" | "unauthenticated" = session?.user ? "authenticated" : "unauthenticated";
    let teams: Team[] = [];

    if (session?.user) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                team: true,
                teams: true,
            }
        });

        if (user?.team) {
            teams.push(user.team);
            user.teams.filter((team: Team) => team.id !== user.team?.id).map((team: Team) => teams.push(team));
        } else {
            teams = user?.teams ?? [];
        }
    }

    return (
        <>
            <div className="flex w-72 flex-col h-screen fixed overflow-y-auto">
                <div
                    className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <nav className="flex flex-1 flex-col mt-5">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navigation
                                        .filter((item) => !item.signInRequired || (item.signInRequired && status === "authenticated" && userHasAccess(item.role ? item.role : null, session?.user)))
                                        .map((link) => (
                                            <SidebarLink key={link.title} title={link.title} href={link.path}
                                                         exact={link.exact} badge={link.badge}/>
                                        ))}
                                </ul>
                            </li>
                            <li>
                                {teams.length > 0 && (
                                    <>
                                        <div className="text-xs/6 font-semibold text-gray-400">Your teams</div>
                                        <ul className="-mx-2 mt-2 space-y-1">
                                            {teams.map((team) => (
                                                <li key={team.id}>
                                                    <a href="#" className="group relative flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
                                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:border-primary-600 dark:group-hover:border-gray-700 group-hover:text-primary-600 dark:group-hover:text-white">{team.abbreviation.substring(0, 1)}</span>
                                                        <span className="truncate">
                                                            {team.abbreviation}
                                                        </span>
                                                        <div className="tooltip bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded py-1 px-2">
                                                            {team.name}
                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}