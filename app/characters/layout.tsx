'use client';

import React, { useEffect, useState } from "react";
import { roles } from "@/lib/roles";
import { useSession } from "next-auth/react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { charactersApi } from "@/lib/apiClient";

export default function CharacterLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: session, status } = useSession();
    const [pendingCount, setPendingCount] = useState<number>(0);

    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const response = await charactersApi.getPendingCharacters(0);
                setPendingCount(response.data.totalCount || 0);
            } catch (error) {
                console.error('Failed to fetch pending character count:', error);
            }
        };

        fetchPendingCount();
    }, []);

    const navigationLinks: {title: string, path: string, exact: boolean, signInRequired: boolean, role?: string, badge?: number}[] = [
        { title: "Dashboard", path: "/characters", exact: true, signInRequired: true, role: roles[1] },
        { title: "Approval Queue", path: "/characters/pending", exact: false, signInRequired: true, role: roles[3], badge: pendingCount }
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