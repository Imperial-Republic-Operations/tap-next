'use client'

import { AssetType } from "@/app/inventory/_components/InventoryDashboard";
import { Item, Ship, Vehicle } from "@/lib/generated/prisma";
import { useEffect, useState } from "react";

interface InventoryFilterProps {
    assetType: AssetType;
    assets: (Item | Ship | Vehicle)[];
    onFiltersChange: (filters: FilterGroup[]) => void;
}

interface FilterCondition {
    type: 'condition';
    field: string;
    operator: string;
    value: string;
}

interface FilterOperator {
    type: 'operator';
    value: 'AND' | 'OR';
}

type FilterGroup = FilterCondition | FilterOperator;

export default function InventoryFilter({assetType, assets, onFiltersChange}: InventoryFilterProps) {
    const [filters, setFilters] = useState<FilterGroup[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const getAvailableFields = () => {
        if (assetType === 'items') {
            return [
                { key: 'quantity', label: 'Quantity', type: 'number' },
                { key: 'model.name', label: 'Model Name', type: 'string' },
                { key: 'model.type', label: 'Type', type: 'string' },
                { key: 'model.weight', label: 'Weight', type: 'number' },
                { key: 'model.description', label: 'Description', type: 'string' },
                { key: 'model.stackable', label: 'Stackable', type: 'boolean' },
            ];
        } else if (assetType === 'ships') {
            return [
                { key: 'name', label: 'Name', type: 'string' },
                { key: 'crewCapacity', label: 'Crew Capacity', type: 'number' },
                { key: 'cargoCapacity', label: 'Cargo Capacity', type: 'number' },
                { key: 'passengerCapacity', label: 'Passenger Capacity', type: 'number' },
                { key: 'model.name', label: 'Model Name', type: 'string' },
                { key: 'model.manufacturer', label: 'Manufacturer', type: 'string' },
            ];
        } else if (assetType === 'vehicles') {
            return [
                { key: 'name', label: 'Name', type: 'string' },
                { key: 'crewCapacity', label: 'Crew Capacity', type: 'number' },
                { key: 'cargoCapacity', label: 'Cargo Capacity', type: 'number' },
                { key: 'model.name', label: 'Model Name', type: 'string' },
                { key: 'model.manufacturer', label: 'Manufacturer', type: 'string' },
            ];
        }
        return [];
    };

    const getOperatorsForFieldType = (fieldType: string) => {
        if (fieldType === 'string') {
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'not_equals', label: 'Not Equals' },
                { value: 'contains', label: 'Contains' },
                { value: 'not_contains', label: 'Does Not Contain' },
                { value: 'starts_with', label: 'Starts With' },
                { value: 'ends_with', label: 'Ends With' },
            ];
        } else if (fieldType === 'number') {
            return [
                { value: 'equals', label: 'Equals' },
                { value: 'not_equals', label: 'Not Equals' },
                { value: 'greater_than', label: 'Greater Than' },
                { value: 'less_than', label: 'Less Than' },
                { value: 'greater_than_or_equal', label: 'Greater Than or Equal' },
                { value: 'less_than_or_equal', label: 'Less Than or Equal' },
            ];
        } else if (fieldType === 'boolean') {
            return [
                { value: 'equals', label: 'Is' },
                { value: 'not_equals', label: 'Is Not' },
            ];
        }
        return [];
    };

    const addFilter = () => {
        const newFilter: FilterCondition = {
            type: 'condition',
            field: getAvailableFields()[0]?.key || '',
            operator: 'equals',
            value: '',
        };

        const newFilters = [...filters];
        if (filters.length > 0) {
            newFilters.push({ type: 'operator', value: 'AND' } as FilterOperator);
        }
        newFilters.push(newFilter);
        setFilters(newFilters);
    };

    const removeFilter = (index: number) => {
        const newFilters = [...filters];

        newFilters.splice(index, 1);

        if (index > 0 && newFilters[index - 1]?.type === 'operator') {
            newFilters.splice(index - 1, 1);
        } else if (index < newFilters.length && newFilters[index]?.type === 'operator') {
            newFilters.splice(index, 1);
        }

        setFilters(newFilters);
    };

    const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
        const newFilters = [...filters];
        const filter = newFilters[index] as FilterCondition;
        newFilters[index] = { ...filter, ...updates };
        setFilters(newFilters);
    };

    const updateOperator = (index: number, operator: 'AND' | 'OR') => {
        const newFilters = [...filters];
        const filterOp = newFilters[index] as FilterOperator;
        newFilters[index] = { ...filterOp, value: operator };
        setFilters(newFilters);
    };

    const clearFilters = () => {
        setFilters([]);
    };

    useEffect(() => {
        onFiltersChange(filters);
    }, [filters, onFiltersChange]);

    const availableFields = getAvailableFields();

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filter ({filters.filter(f => f.type === 'condition').length})
                    <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {filters.length > 0 && (
                    <button
                        onClick={clearFilters}
                        className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {showFilters && (
                <div className="space-y-3">
                    {filters.map((filter, index) => (
                        <div key={index}>
                            {filter.type === 'condition' ? (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <select
                                        value={filter.field}
                                        onChange={(e) => updateFilter(index, { field: e.target.value, operator: 'equals' })}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                    >
                                        {availableFields.map(field => (
                                            <option key={field.key} value={field.key}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={filter.operator}
                                        onChange={(e) => updateFilter(index, { operator: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                    >
                                        {getOperatorsForFieldType(
                                            availableFields.find(f => f.key === filter.field)?.type || 'string'
                                        ).map(op => (
                                            <option key={op.value} value={op.value}>
                                                {op.label}
                                            </option>
                                        ))}
                                    </select>

                                    {availableFields.find(f => f.key === filter.field)?.type === 'boolean' ? (
                                        <select
                                            value={filter.value}
                                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        >
                                            <option value="">Select...</option>
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={availableFields.find(f => f.key === filter.field)?.type === 'number' ? 'number' : 'text'}
                                            value={filter.value}
                                            onChange={(e) => updateFilter(index, { value: e.target.value })}
                                            placeholder="Enter value..."
                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        />
                                    )}

                                    <button
                                        onClick={() => removeFilter(index)}
                                        className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <button
                                            onClick={() => updateOperator(index, 'AND')}
                                            className={`px-3 py-1 rounded text-sm font-medium ${
                                                filter.value === 'AND'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400'
                                            }`}
                                        >
                                            AND
                                        </button>
                                        <button
                                            onClick={() => updateOperator(index, 'OR')}
                                            className={`px-3 py-1 rounded text-sm font-medium ${
                                                filter.value === 'OR'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400'
                                            }`}
                                        >
                                            OR
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={addFilter}
                        className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                        Add Filter Condition
                    </button>
                </div>
            )}
        </div>
    );
}