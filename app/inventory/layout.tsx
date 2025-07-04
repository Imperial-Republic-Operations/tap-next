import React from "react";

export default function InventoryLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return(
        <div className="w-full">
            {children}
        </div>
    );
}