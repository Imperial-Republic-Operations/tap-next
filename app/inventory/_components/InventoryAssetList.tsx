'use client'

import { Item, Ship, Vehicle } from "@/lib/generated/prisma";
import { AssetType } from "@/app/inventory/_components/InventoryDashboard";
import { useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import InventoryFilter from "./InventoryFilter";

interface InventoryAssetListProps {
    assetType: AssetType;
    assets: (Item | Ship | Vehicle)[];
    onCloseAction: () => void;
}

const ITEMS_PER_PAGE = 10;

function evaluateFilters(filters: any[], asset: any): boolean {
    if (filters.length === 0) return true;

    // Convert to a flat array of conditions with operators
    const conditions = [];

    for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        if (filter.type === 'condition') {
            conditions.push({
                type: 'condition',
                field: filter.field,
                operator: filter.operator,
                value: filter.value,
            });
        } else if (filter.type === 'operator') {
            conditions.push({
                type: 'operator',
                value: filter.value,
            });
        }
    }

    // Evaluate conditions
    if (conditions.length === 0) return true;

    let result = evaluateCondition(conditions[0], asset);

    for (let i = 1; i < conditions.length; i += 2) {
        if (i + 1 >= conditions.length) break;

        const operator = conditions[i];
        const condition = conditions[i + 1];

        if (operator.type === 'operator') {
            const conditionResult = evaluateCondition(condition, asset);

            if (operator.value === 'AND') {
                result = result && conditionResult;
            } else if (operator.value === 'OR') {
                result = result || conditionResult;
            }
        }
    }

    return result;
}

function evaluateCondition(condition: any, asset: any): boolean {
    if (condition.type !== 'condition') return true;

    // Handle nested field access (e.g., 'model.name')
    const fieldParts = condition.field.split('.');
    let assetValue = asset;

    for (const part of fieldParts) {
        if (assetValue && typeof assetValue === 'object') {
            assetValue = assetValue[part];
        } else {
            assetValue = undefined;
            break;
        }
    }

    const filterValue = condition.value;

    if (assetValue === null || assetValue === undefined) return false;

    switch (condition.operator) {
        case 'equals':
            if (typeof assetValue === 'boolean') {
                return assetValue === (filterValue === 'true' || filterValue === true);
            }
            return String(assetValue).toLowerCase() === String(filterValue).toLowerCase();
        case 'not_equals':
            if (typeof assetValue === 'boolean') {
                return assetValue !== (filterValue === 'true' || filterValue === true);
            }
            return String(assetValue).toLowerCase() !== String(filterValue).toLowerCase();
        case 'contains':
            return String(assetValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'not_contains':
            return !String(assetValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'starts_with':
            return String(assetValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
        case 'ends_with':
            return String(assetValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
        case 'greater_than':
            return Number(assetValue) > Number(filterValue);
        case 'less_than':
            return Number(assetValue) < Number(filterValue);
        case 'greater_than_or_equal':
            return Number(assetValue) >= Number(filterValue);
        case 'less_than_or_equal':
            return Number(assetValue) <= Number(filterValue);
        default:
            return true;
    }
}

export default function InventoryAssetList({assetType, assets, onCloseAction}: InventoryAssetListProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState<any[]>([]);

    const filteredAssets = useMemo(() => {
        if (filters.length === 0) return assets;

        return assets.filter(asset => {
            return evaluateFilters(filters, asset);
        });
    }, [assets, filters]);

    const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
    const paginatedAssets = useMemo(() => {
        const startIndex = currentPage * ITEMS_PER_PAGE;
        return filteredAssets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAssets, currentPage]);

    const handleFiltersChange = (newFilters: any[]) => {
        setFilters(newFilters);
        setCurrentPage(0);
    };

    const getAssetDisplayName = (asset: Item | Ship | Vehicle) => {
        if (assetType === 'items') {
            return (asset as any).model?.name || 'Unnamed Item';
        } else if (assetType === 'ships') {
            return (asset as Ship).name || 'Unnamed Ship';
        }
        return (asset as Vehicle).name || 'Unnamed Vehicle';
    };

    const getAssetFields = (asset: Item | Ship | Vehicle) => {
        const commonFields = {
            id: asset.id.toString(),
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
        };

        if (assetType === 'items') {
            const item = asset as Item;
            return {
                ...commonFields,
                quantity: item.quantity,
                modelName: (item as any).model?.name,
                modelType: (item as any).model?.type,
                weight: (item as any).model?.weight,
                description: (item as any).model?.description,
                stackable: (item as any).model?.stackable,
            };
        } else if (assetType === 'ships') {
            const ship = asset as Ship;
            return {
                ...commonFields,
                name: ship.name,
                crewCapacity: ship.crewCapacity,
                cargoCapacity: ship.cargoCapacity,
                passengerCapacity: ship.passengerCapacity,
                modelName: (ship as any).model?.name,
                manufacturer: (ship as any).model?.manufacturer,
            };
        } else if (assetType === 'vehicles') {
            const vehicle = asset as Vehicle;
            return {
                ...commonFields,
                name: vehicle.name,
                crewCapacity: vehicle.crewCapacity,
                cargoCapacity: vehicle.cargoCapacity,
                modelName: (vehicle as any).model?.name,
                manufacturer: (vehicle as any).model?.manufacturer,
            };
        }

        return commonFields;
    };

    const renderAssetCard = (asset: Item | Ship | Vehicle) => {
        const fields = getAssetFields(asset);

        return (
            <div key={asset.id.toString()} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getAssetDisplayName(asset)}
                    </h3>
                    {assetType === 'items' && (
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Qty: {(asset as Item).quantity}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(fields).map(([key, value]) => {
                        if (key === 'id' || key === 'createdAt' || key === 'updatedAt' || !value) return null;

                        return (
                            <div key={key} className="flex flex-col">
                                <span className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="text-gray-900 dark:text-white">
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {assetType} ({filteredAssets.length} of {assets.length})
                </h2>
                <button
                    onClick={onCloseAction}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <InventoryFilter
                assetType={assetType}
                assets={assets}
                onFiltersChange={handleFiltersChange}
            />

            {paginatedAssets.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {paginatedAssets.map(renderAssetCard)}
                    </div>
                    {renderPagination()}
                </>
            ) : (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No {assetType} found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {filters.length > 0 ? 'Try adjusting your filters to see more results.' : `No ${assetType} in inventory.`}
                    </p>
                </div>
            )}
        </div>
    );
}