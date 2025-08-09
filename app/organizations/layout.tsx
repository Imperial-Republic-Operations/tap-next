import React from "react";
import { roles } from "@/lib/roles";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { getSession } from "@/lib/auth";
import { NavigationItem } from "@/lib/navigation";

const navigationLinks: NavigationItem[] = [
    { title: "Dashboard", path: "/organizations", exact: true, access: { type: 'open' } },
    { title: "Security Clearances", path: "/organizations/security-clearances", exact: true, access: { type: 'role', role: roles[3] } },
    { title: "Characters with Clearances", path: "/organizations/characters-with-clearances", exact: true, access: { type: 'role', role: roles[2] } },
];

export default async function OrganizationLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const {session} = await getSession();

    return(
        <div className="flex">
            <CollapsibleSidebar navigation={navigationLinks} session={session} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}