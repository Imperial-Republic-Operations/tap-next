'use client'

import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        // Clear the activeCharacterId cookie before signing out
        Cookies.remove('activeCharacterId');
        
        // Sign out without redirect first
        await signOut({ redirect: false });
        
        // Then manually navigate to home page
        router.push('/');
        router.refresh();
    };

    return (
        <button 
            onClick={handleLogout}
            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full text-left"
        >
            Logout
        </button>
    );
}