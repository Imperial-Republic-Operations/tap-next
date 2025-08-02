'use client'

import { useRouter } from "next/navigation";

export default function ActiveCharacterSelector({characterId, children, close}: {characterId: bigint, children: React.ReactNode, close?: () => void}) {
    const router = useRouter();

    const handleClick = () => {
        document.cookie = `activeCharacterId=${characterId}; path=/; SameSite=Lax`;
        window.dispatchEvent(new Event('activeCharacterChanged'));
        router.refresh();
        
        // Close the menu if close function is provided
        if (close) {
            close();
        }
    }

    return (
        <a onClick={handleClick} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full text-left">
            {children}
        </a>
    );
}