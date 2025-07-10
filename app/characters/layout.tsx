import React from "react";
import { roles } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";

const navigationLinks: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[] = [
    { title: "Dashboard", path: "/characters", exact: true, signInRequired: true, role: roles[1] },
    { title: "Approval Queue", path: "/characters/pending", exact: false, signInRequired: true, role: roles[3], badge: await getPendingCharacterCount() }
];

async function getPendingCharacterCount(): Promise<number> {
    const pending = await prisma.character.findMany({
        where: { approvalStatus: "PENDING" }
    });

    return pending.length;
}

export default async function CharacterLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const {session, status} = await getSession();

    return(
        <div className="flex">
            <CollapsibleSidebar navigation={navigationLinks} session={session} status={status} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}