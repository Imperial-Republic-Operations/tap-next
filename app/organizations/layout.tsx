import React from "react";
import { roles } from "@/lib/roles";
import Sidebar from "@/components/Sidebar";

const navigationLinks: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[] = [
    { title: "Dashboard", path: "/organizations", exact: true, signInRequired: false, role: roles[1] },
];

export default function OrganizationLayout({
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