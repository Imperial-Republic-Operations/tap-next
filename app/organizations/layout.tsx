import React from "react";
import { getSession } from "@/lib/auth";
import { getNavigationItems } from "@/lib/navigationDB";
import { NavigationLocation } from "@/lib/generated/prisma";
import Sidebar from "@/components/Sidebar";

export default async function OrganizationLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const { session } = await getSession();

    const headerNavigation = await getNavigationItems(NavigationLocation.HEADER_MAIN, session?.user);
    const parentItem = headerNavigation.find(item => item.path === '/organizations');

    const sidebarNavigation = await getNavigationItems(
        NavigationLocation.SIDEBAR,
        session?.user,
        parentItem ? parentItem.id.toString() : undefined
    );

    return(
        <div className="flex">
            <Sidebar navigation={sidebarNavigation} session={session} parentItem={parentItem} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}