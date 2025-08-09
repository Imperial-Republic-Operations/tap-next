'use client';

import React from "react";
import { roles } from "@/lib/roles";
import { useSession } from "next-auth/react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { NavigationItem } from "@/lib/navigation";

export default function MapLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();

    const navigationLinks: NavigationItem[] = [
        { title: "Galaxy Map", path: "/map", exact: true, access: { type: 'role', role: roles[1] } },
        { title: "Map Editor", path: "/map/edit", exact: false, access: { type: 'role-and-team', role: roles[4], team: 'moderation', overrideRole: roles[6] } }
    ];

    return(
        <div className="flex">
            <CollapsibleSidebar navigation={navigationLinks} session={session} status={status} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}