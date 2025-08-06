'use client';

import React from "react";
import GalaxyMapViewer from "./_components/GalaxyMapViewer";

export default function MapPage() {
    return (
        <div className="space-y-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Galaxy Map
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Interactive map of the galaxy showing oversectors, sectors, systems, and planets
                </p>
            </div>
            <div className="p-6">
                <GalaxyMapViewer />
            </div>
        </div>
    );
}