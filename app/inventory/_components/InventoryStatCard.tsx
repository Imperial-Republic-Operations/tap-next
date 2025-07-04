'use client'

interface InventoryStatCardProp {
    label: string;
    value: string | number;
}

export default function InventoryStatCard({ label, value }: InventoryStatCardProp) {
    return (
        <div className="flex flex-col bg-gray-400/5 p-8 dark:bg-white/5">
            <dt className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {value}
            </dd>
        </div>
    );
}