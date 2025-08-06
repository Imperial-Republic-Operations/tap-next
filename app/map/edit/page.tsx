'use client';

import React from "react";
import GalaxyMapEditor from "../_components/GalaxyMapEditor";

export default function MapEditPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Galaxy Map Editor
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Administrative tools for creating and editing galaxy map entities
                    </p>
                </div>
                <div className="p-6">
                    <GalaxyMapEditor />
                </div>
            </div>
        </div>
    );
}