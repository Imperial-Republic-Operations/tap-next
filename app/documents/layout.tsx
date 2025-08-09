import React from "react";
import { getSession } from "@/lib/auth";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { NavigationItem } from "@/lib/navigation";

const navigationLinks: NavigationItem[] = [
    { title: "Dashboard", path: "/documents", exact: true, access: { type: 'open' } },
];

export default async function DocumentLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const {session} = await getSession();

    return(
        <div className="flex">
            {/*<Sidebar navigation={navigationLinks} />*/}
            <CollapsibleSidebar navigation={navigationLinks} session={session} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}