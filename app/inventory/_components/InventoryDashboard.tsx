'use client';

import { useEffect, useState } from 'react';
import { CharacterDetails, fetchCharacter } from "@/lib/_characters";
import { fetchInventoryCounts, InventoryContents } from "@/lib/_inventory";
import { CreditAccount, InventoryType, Item, Ship, Vehicle } from "@/lib/generated/prisma";
import InventoryStatCard from "@/app/inventory/_components/InventoryStatCard";
import Cookies from 'js-cookie';

export default function InventoryDashboard() {
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [ships, setShips] = useState<Ship[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [credits, setCredits] = useState(0);
    const [targets, setTargets] = useState<{type: InventoryType, id: bigint, name: string}[]>([]);
    const [selectedTarget, setSelectedTarget] = useState<{type: InventoryType, id: bigint, name: string} | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = parseInt(e.target.value);
        const selected = targets[index];
        if (selected) {
            setSelectedTarget(selected);
            loadInventory();
        }
    };

    const loadInventory = async() => {
        const {inventory, creditAccount}: { inventory: InventoryContents | null, creditAccount: CreditAccount | null } = await fetchInventoryCounts(selectedTarget!.id, selectedTarget!.type);
        if (inventory) {
            setItems(inventory.items);
            setShips(inventory.ships);
            setVehicles(inventory.vehicles);
        }
        if (creditAccount) setCredits(creditAccount.balance);
    };

    const syncActiveCharacterId = () => {
        const id = Cookies.get('activeCharacterId');
        setActiveCharacterId(id || null);
    };

    useEffect(() => {
        // Initial load
        syncActiveCharacterId();

        // Listen for character change
        window.addEventListener('activeCharacterChanged', syncActiveCharacterId);

        return () => {
            window.removeEventListener('activeCharacterChanged', syncActiveCharacterId);
        };
    }, []);

    useEffect(() => {
        if (!activeCharacterId) return;
        const load = async () => {
            const character: CharacterDetails = (await fetchCharacter(BigInt(activeCharacterId)))!;
            const memberships = character.memberships;

            const orgs = memberships
                .filter(m => m.position?.permissions?.some((p) => p.value === 'LEADER') || m.position?.permissions?.some((p) => p.value === 'MANAGE_ASSETS'))
                .map(m => m.organization);

            const t: {type: InventoryType, id: bigint, name: string}[] = [
                {type: 'CHARACTER', id: character.id, name: character.name},
                ...orgs.map(o => {
                    const type: InventoryType = 'ORGANIZATION';
                        return {type, id: o.id, name: o.name};
                }),
            ];
            setTargets(t);
            setSelectedTarget(t[0]);
        };

        load();
    }, [activeCharacterId]);

    useEffect(() => {
        if (!selectedTarget) return;

        loadInventory();
    }, [selectedTarget]);

    return(
        <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
                            View Inventory
                        </h2>
                        <div className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            <div className="mt-2 grid grid-cols-1 relative">
                                <select
                                    id="inventoryTarget"
                                    value={selectedTarget ? targets.findIndex(t => t.id === selectedTarget.id && t.type === selectedTarget.type) : ''}
                                    onChange={handleChange}
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm dark:bg-gray-900 dark:outline-gray-600 dark:text-white"
                                >
                                    {targets.map((target, index) => (
                                        <option key={`${target.type}-${target.id.toString()}`} value={index}>
                                            {target.type === 'CHARACTER' ? 'Character: ' : 'Organization: '}
                                            {target.name}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 absolute right-2 top-1/2 transform -translate-y-1/2"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        <InventoryStatCard label="Credits" value={`${credits.toLocaleString()} cr`} />
                        <InventoryStatCard label="Items" value={items.length.toLocaleString()} />
                        <InventoryStatCard label="Ships" value={ships.length.toLocaleString()} />
                        <InventoryStatCard label="Vehicles" value={vehicles.length.toLocaleString()} />
                    </dl>
                </div>
            </div>
        </div>
    );
}