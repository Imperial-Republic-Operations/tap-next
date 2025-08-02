import React from "react";
import { roles } from "@/lib/roles";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { getSession } from "@/lib/auth";

const navigationLinks: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[] = [
    { title: "Dashboard", path: "/organizations", exact: true, signInRequired: false },
    { title: "Security Clearances", path: "/organizations/security-clearances", exact: true, signInRequired: true, role: roles[3] },
    { title: "Characters with Clearances", path: "/organizations/characters-with-clearances", exact: true, signInRequired: true, role: roles[2] },
];

export default async function OrganizationLayout({
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