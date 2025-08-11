import { getSession } from "@/lib/auth";
import { getServerTranslations } from "@/lib/i18nServer";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { NavigationItem } from "@/lib/navigation";
import { roles } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

export default async function PoliticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { session } = await getSession();
    const t = await getServerTranslations(session?.user?.id);

    const navigation: NavigationItem[] = [
        {
            title: t.politics.dashboard,
            path: "/politics",
            exact: true,
            access: { type: 'role', role: roles[1] }
        },
        {
            title: t.politics.senate,
            path: "/politics/senate",
            exact: false,
            access: {
                type: 'custom',
                customAccess: async (user) => {
                    if (!user) return false;

                    const senator = await prisma.senator.findUnique({
                        where: {
                            userId: user.id,
                        },
                    });

                    return !!senator;
                },
                overrideAccess: {
                    type: 'role-and-team',
                    role: roles[3],
                    team: 'moderation',
                    overrideRole: roles[5],
                },
            },
        },
        {
            title: t.politics.committees,
            path: "/politics/committees",
            exact: false,
            access: {
                type: 'custom',
                customAccess: async (user) => {
                    if (!user) return false;

                    const senateLeadershipData = await prisma.senateSettings.findFirst({
                        include: {
                            supremeRulerPosition: {
                                include: {
                                    members: {
                                        include: {
                                            character: true,
                                        },
                                    },
                                },
                            },
                            presidentPosition: {
                                include: {
                                    members: {
                                        include: {
                                            character: true,
                                        },
                                    },
                                },
                            },
                            vicePresidentPosition: {
                                include: {
                                    members: {
                                        include: {
                                            character: true,
                                        },
                                    },
                                },
                            },
                        },
                    });

                    if (!senateLeadershipData) return false;

                    return senateLeadershipData.supremeRulerPosition.members.some(member => member.character.userId === user.id)
                        || senateLeadershipData.presidentPosition.members.some(member => member.character.userId === user.id)
                        || senateLeadershipData.vicePresidentPosition.members.some(member => member.character.userId === user.id);
                },
                overrideAccess: {
                    type: 'role-and-team',
                    role: roles[4],
                    team: 'moderation',
                    overrideRole: roles[6],
                },
            },
        },
        {
            title: t.politics.highCouncil,
            path: "/politics/high-council",
            exact: false,
            access: { type: 'role', role: roles[1] }
        }
    ];

    return (
        <div className="flex">
            <CollapsibleSidebar navigation={navigation} session={session} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}