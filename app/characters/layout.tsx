import React from "react";
import { roles } from "@/lib/roles";
import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";

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

export default function CharacterLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return(
        <div className="flex">
            <Sidebar navigation={navigationLinks} />
            <div className="flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}