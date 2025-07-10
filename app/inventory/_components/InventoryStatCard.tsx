'use client'

import { classNames } from "@/lib/style";

interface InventoryStatCardProp {
    label: string;
    value: string | number;
    clickable?: boolean;
    isActive?: boolean;
    onClick?: () => void;
}

export default function InventoryStatCard({ label, value, clickable = false, isActive = false, onClick }: InventoryStatCardProp) {
    const baseClasses = 'flex flex-col bg-gray-400/5 p-8 dark:bg-white/5 transition-all duration-200';
    const clickableClasses = clickable && 'cursor-pointer hover:bg-gray-400/10 dark:hover:bg-white/10 hover:scale-105 hover:shadow-lg';
    const activeClasses = isActive && 'bg-primary-100 dark:bg-primary-900/20 ring-2 ring-primary-500 dark:ring-primary-400';

    const handleClick = () => {
        if (clickable && onClick) {
            onClick();
        }
    }
    return (
        <div className={classNames(clickableClasses, activeClasses, baseClasses)} onClick={handleClick} role={clickable ? 'button' : undefined} tabIndex={clickable ? 0 : undefined} onKeyDown={clickable ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
            }
        } : undefined}>
            <dt className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                {label}
                {clickable && (
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {value}
            </dd>
        </div>
    );
}