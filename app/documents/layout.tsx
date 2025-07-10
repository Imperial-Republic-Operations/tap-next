import React from "react";
import { getSession } from "@/lib/auth";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";

const navigationLinks: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[] = [
    { title: "Dashboard", path: "/documents", exact: true, signInRequired: false },
];

export default async function DocumentLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const {session, status} = await getSession();

    return(
        <div className="flex">
            {/*<Sidebar navigation={navigationLinks} />*/}
            <CollapsibleSidebar navigation={navigationLinks} session={session} status={status} />
            <div className="sidebar-content flex-1 self-start overflow-y-auto mt-5 pl-75 pr-5">
                {children}
            </div>
        </div>
    );
}