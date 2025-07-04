import React from "react";
import Sidebar from "@/components/Sidebar";

const navigationLinks: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[] = [
    { title: "Dashboard", path: "/documents", exact: true, signInRequired: false },
];

export default function DocumentLayout({
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