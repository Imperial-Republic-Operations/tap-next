'use client';

import React, { useEffect, useState } from "react";
import { mapApi } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { roles, userHasAccess } from "@/lib/roles";
import { PlusIcon } from "@heroicons/react/24/outline";

interface EntityFormData {
    name: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    color?: string;
    habitable?: boolean;
    forceProbabilityModifier?: number;
}

interface Entity {
    id: string;
    name: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    color?: string;
    habitable?: boolean;
    forceProbabilityModifier?: number;
}

export default function GalaxyMapEditor() {
    const { data: session } = useSession();
    const [selectedEntityType, setSelectedEntityType] = useState<'oversector' | 'sector' | 'system' | 'planet'>('oversector');
    const [parentId, setParentId] = useState<string>('');
    
    // Store the full hierarchy path for persistence
    const [selectedOversector, setSelectedOversector] = useState<string>('');
    const [selectedSector, setSelectedSector] = useState<string>('');
    const [selectedSystem, setSelectedSystem] = useState<string>('');
    const [formData, setFormData] = useState<EntityFormData>({
        name: '',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        color: '#e5e7eb'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Parent entity options
    const [oversectors, setOversectors] = useState<Entity[]>([]);
    const [sectors, setSectors] = useState<Entity[]>([]);
    const [systems, setSystems] = useState<Entity[]>([]);
    const [planets, setPlanets] = useState<Entity[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const isAdmin = session?.user && userHasAccess(roles[4], session.user); // ASSISTANT_ADMIN level

    useEffect(() => {
        const checkAccess = async () => {
            setIsLoading(true);
            // Wait for session to load
            if (session !== undefined) {
                if (isAdmin) {
                    await fetchOversectors();
                }
                setIsLoading(false);
            }
        };
        checkAccess();
    }, [session, isAdmin]);

    // Track the last fetched parent IDs to know when to refetch
    const [lastFetchedOversector, setLastFetchedOversector] = useState<string>('');
    const [lastFetchedSector, setLastFetchedSector] = useState<string>('');
    const [lastFetchedSystem, setLastFetchedSystem] = useState<string>('');

    // Fetch sectors when oversector changes
    useEffect(() => {
        if (selectedOversector && selectedOversector !== lastFetchedOversector) {
            fetchSectorsForOversector(selectedOversector);
            setLastFetchedOversector(selectedOversector);
            // Clear child data when parent changes
            setSystems([]);
            setPlanets([]);
            setSelectedSector('');
            setSelectedSystem('');
            setLastFetchedSector('');
            setLastFetchedSystem('');
        } else if (!selectedOversector && lastFetchedOversector) {
            // Clear sectors and all child data when oversector is deselected
            setSectors([]);
            setSystems([]);
            setPlanets([]);
            setSelectedSector('');
            setSelectedSystem('');
            setLastFetchedOversector('');
            setLastFetchedSector('');
            setLastFetchedSystem('');
        }
    }, [selectedOversector]);

    // Fetch systems when sector changes
    useEffect(() => {
        if (selectedSector && selectedSector !== lastFetchedSector) {
            fetchSystemsForSector(selectedSector);
            setLastFetchedSector(selectedSector);
            // Clear child data when parent changes
            setPlanets([]);
            setSelectedSystem('');
            setLastFetchedSystem('');
        } else if (!selectedSector && lastFetchedSector) {
            // Clear systems and all child data when sector is deselected
            setSystems([]);
            setPlanets([]);
            setSelectedSystem('');
            setLastFetchedSector('');
            setLastFetchedSystem('');
        }
    }, [selectedSector]);

    // Fetch planets when system changes
    useEffect(() => {
        if (selectedSystem && selectedSystem !== lastFetchedSystem) {
            fetchPlanetsForSystem(selectedSystem);
            setLastFetchedSystem(selectedSystem);
        } else if (!selectedSystem && lastFetchedSystem) {
            // Clear planets when system is deselected
            setPlanets([]);
            setLastFetchedSystem('');
        }
    }, [selectedSystem]);

    const fetchOversectors = async () => {
        try {
            const response = await mapApi.getOversectors();
            setOversectors(response.data);
        } catch (err) {
            console.error('Failed to fetch oversectors:', err);
        }
    };

    const fetchSectorsForOversector = async (oversectorId: string) => {
        try {
            const response = await mapApi.getSectorsForOversector(BigInt(oversectorId));
            setSectors(response.data);
        } catch (err) {
            console.error('Failed to fetch sectors:', err);
        }
    };

    const fetchSystemsForSector = async (sectorId: string) => {
        try {
            const response = await mapApi.getSystemsForSector(BigInt(sectorId));
            setSystems(response.data);
        } catch (err) {
            console.error('Failed to fetch systems:', err);
        }
    };

    const fetchPlanetsForSystem = async (systemId: string) => {
        try {
            const response = await mapApi.getPlanetsForSystem(BigInt(systemId));
            setPlanets(response.data);
        } catch (err) {
            console.error('Failed to fetch planets:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            x: 0,
            y: 0,
            width: selectedEntityType === 'planet' ? undefined : 100,
            height: selectedEntityType === 'planet' ? undefined : 100,
            radius: selectedEntityType === 'planet' ? 5 : undefined,
            color: selectedEntityType === 'oversector' ? '#e5e7eb' : 
                   selectedEntityType === 'sector' ? '#f3f4f6' :
                   selectedEntityType === 'system' ? '#fbbf24' : '#10b981',
            habitable: selectedEntityType === 'planet' ? true : undefined,
            forceProbabilityModifier: selectedEntityType === 'planet' ? 1.0 : undefined
        });
        setParentId('');
        setIsEditing(false);
        setEditingId(null);
        setError(null);
        setSuccess(null);
    };

    const handleEntityTypeChange = (type: 'oversector' | 'sector' | 'system' | 'planet') => {
        setSelectedEntityType(type);
        
        // Set parentId based on the selected hierarchy and entity type
        switch (type) {
            case 'oversector':
                setParentId('');
                break;
            case 'sector':
                setParentId(selectedOversector);
                break;
            case 'system':
                setParentId(selectedSector);
                break;
            case 'planet':
                setParentId(selectedSystem);
                break;
        }
        
        // Only reset form data, not hierarchy
        setFormData({
            name: '',
            x: 0,
            y: 0,
            width: type === 'planet' ? undefined : 100,
            height: type === 'planet' ? undefined : 100,
            radius: type === 'planet' ? 5 : undefined,
            color: type === 'oversector' ? '#e5e7eb' : 
                   type === 'sector' ? '#f3f4f6' :
                   type === 'system' ? '#fbbf24' : '#10b981',
            habitable: type === 'planet' ? true : undefined,
            forceProbabilityModifier: type === 'planet' ? 1.0 : undefined
        });
        setIsEditing(false);
        setEditingId(null);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEditing && editingId) {
                // Update existing entity
                switch (selectedEntityType) {
                    case 'oversector':
                        await mapApi.updateOversector(BigInt(editingId), formData);
                        break;
                    case 'sector':
                        await mapApi.updateSector(BigInt(editingId), formData);
                        break;
                    case 'system':
                        await mapApi.updateSystem(BigInt(editingId), formData);
                        break;
                    case 'planet':
                        await mapApi.updatePlanet(BigInt(editingId), formData);
                        break;
                }
                setSuccess(`${selectedEntityType} updated successfully!`);
            } else {
                // Create new entity
                switch (selectedEntityType) {
                    case 'oversector':
                        await mapApi.createOversector(formData);
                        break;
                    case 'sector':
                        if (!parentId) new Error('Parent oversector is required');
                        await mapApi.createSector({ ...formData, oversectorId: BigInt(parentId) });
                        break;
                    case 'system':
                        if (!parentId) new Error('Parent sector is required');
                        await mapApi.createSystem({ ...formData, sectorId: BigInt(parentId) });
                        break;
                    case 'planet':
                        if (!parentId) new Error('Parent system is required');
                        await mapApi.createPlanet({ ...formData, systemId: BigInt(parentId) });
                        break;
                }
                setSuccess(`${selectedEntityType} created successfully!`);
            }
            resetForm();
        } catch (err: any) {
            setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} ${selectedEntityType}`);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading map editor...</span>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    Access Denied
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    You need administrator privileges to access the map editor.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Entity Type Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Entity Type
                </label>
                <div className="grid grid-cols-4 gap-4">
                    {(['oversector', 'sector', 'system', 'planet'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleEntityTypeChange(type)}
                            className={`p-3 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                                selectedEntityType === type
                                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <PlusIcon className="h-5 w-5 mx-auto mb-1" />
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Parent Selection */}
            {selectedEntityType !== 'oversector' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Parent {selectedEntityType === 'sector' ? 'Oversector' : 
                                selectedEntityType === 'system' ? 'Sector' : 'System'}
                        {selectedEntityType === 'system' && !parentId && (
                            <span className="text-amber-600 dark:text-amber-400 text-xs ml-2">
                                (Select an oversector first to see sectors)
                            </span>
                        )}
                        {selectedEntityType === 'planet' && !parentId && (
                            <span className="text-amber-600 dark:text-amber-400 text-xs ml-2">
                                (Select oversector → sector to see systems)
                            </span>
                        )}
                    </label>
                    <select
                        value={parentId}
                        onChange={(e) => {
                            const newParentId = e.target.value;
                            setParentId(newParentId);
                            
                            // Update the hierarchy state based on entity type
                            switch (selectedEntityType) {
                                case 'sector':
                                    setSelectedOversector(newParentId);
                                    break;
                                case 'system':
                                    setSelectedSector(newParentId);
                                    break;
                                case 'planet':
                                    setSelectedSystem(newParentId);
                                    break;
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                    >
                        <option value="">
                            {selectedEntityType === 'sector' && 'Select an oversector...'}
                            {selectedEntityType === 'system' && 'Select a sector...'}
                            {selectedEntityType === 'planet' && 'Select a system...'}
                        </option>
                        {selectedEntityType === 'sector' && oversectors.map((oversector) => (
                            <option key={oversector.id} value={oversector.id}>
                                {oversector.name}
                            </option>
                        ))}
                        {selectedEntityType === 'system' && sectors.map((sector) => (
                            <option key={sector.id} value={sector.id}>
                                {sector.name}
                            </option>
                        ))}
                        {selectedEntityType === 'planet' && systems.map((system) => (
                            <option key={system.id} value={system.id}>
                                {system.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Color
                        </label>
                        <input
                            type="color"
                            value={formData.color || '#e5e7eb'}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            X Position
                        </label>
                        <input
                            type="number"
                            value={formData.x}
                            onChange={(e) => setFormData({ ...formData, x: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Y Position
                        </label>
                        <input
                            type="number"
                            value={formData.y}
                            onChange={(e) => setFormData({ ...formData, y: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Size - Width/Height for rectangles, Radius for planets */}
                    {selectedEntityType === 'planet' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Radius
                            </label>
                            <input
                                type="number"
                                value={formData.radius || 5}
                                onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                min="1"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Width
                                </label>
                                <input
                                    type="number"
                                    value={formData.width || 100}
                                    onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Height
                                </label>
                                <input
                                    type="number"
                                    value={formData.height || 100}
                                    onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    min="1"
                                    required
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Planet-specific fields */}
                {selectedEntityType === 'planet' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Habitable
                            </label>
                            <select
                                value={formData.habitable ? 'true' : 'false'}
                                onChange={(e) => setFormData({ ...formData, habitable: e.target.value === 'true' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="true">Habitable</option>
                                <option value="false">Uninhabitable</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Force Probability Modifier
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.forceProbabilityModifier || 1.0}
                                onChange={(e) => setFormData({ ...formData, forceProbabilityModifier: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                min="0"
                                max="2"
                            />
                        </div>
                    </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
                        {success}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        {loading ? 'Processing...' : isEditing ? `Update ${selectedEntityType}` : `Create ${selectedEntityType}`}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Existing Entities Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Oversectors */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <div className="w-3 h-3 border-2 border-gray-400 border-dashed bg-gray-200 bg-opacity-30 mr-2"></div>
                        Oversectors ({oversectors.length})
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {oversectors.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">No oversectors created yet</p>
                        ) : (
                            oversectors.map((oversector) => (
                                <div key={oversector.id} className="text-xs p-2 bg-white dark:bg-gray-700 rounded border text-gray-700 dark:text-gray-300">
                                    {oversector.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sectors */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <div className="w-3 h-3 border border-gray-400 bg-gray-300 bg-opacity-50 mr-2"></div>
                        Sectors ({sectors.length})
                        {(selectedEntityType === 'system' || selectedEntityType === 'planet') && parentId && (
                            <span className="text-xs text-gray-500 ml-1">in selected oversector</span>
                        )}
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedEntityType === 'sector' && oversectors.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Create oversectors first</p>
                        ) : (selectedEntityType === 'system' || selectedEntityType === 'planet') && !selectedOversector ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select an oversector to see sectors</p>
                        ) : sectors.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">No sectors in selected oversector</p>
                        ) : (
                            sectors.map((sector) => (
                                <div key={sector.id} className="text-xs p-2 bg-white dark:bg-gray-700 rounded border text-gray-700 dark:text-gray-300">
                                    {sector.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Systems */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <div className="w-3 h-3 border border-yellow-500 bg-yellow-400 bg-opacity-70 mr-2"></div>
                        Systems ({systems.length})
                        {selectedEntityType === 'planet' && parentId && (
                            <span className="text-xs text-gray-500 ml-1">in selected sector</span>
                        )}
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedEntityType === 'system' && !selectedSector ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select a sector to see systems</p>
                        ) : selectedEntityType === 'planet' && !selectedSector ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select oversector → sector to see systems</p>
                        ) : systems.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">No systems in selected sector</p>
                        ) : (
                            systems.map((system) => (
                                <div key={system.id} className="text-xs p-2 bg-white dark:bg-gray-700 rounded border text-gray-700 dark:text-gray-300">
                                    {system.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Planets */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        Planets ({planets.length})
                        {selectedEntityType === 'planet' && parentId && (
                            <span className="text-xs text-gray-500 ml-1">in selected system</span>
                        )}
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedEntityType === 'planet' && !parentId ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select oversector → sector → system to see planets</p>
                        ) : selectedEntityType !== 'planet' ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Select a system to view planets</p>
                        ) : planets.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">No planets in selected system</p>
                        ) : (
                            planets.map((planet) => (
                                <div key={planet.id} className="text-xs p-2 bg-white dark:bg-gray-700 rounded border text-gray-700 dark:text-gray-300 flex items-center justify-between">
                                    <span>{planet.name}</span>
                                    <div className="w-2 h-2 rounded-full" title={planet.habitable ? "Habitable" : "Uninhabitable"} 
                                         style={{ backgroundColor: planet.habitable ? '#10b981' : '#6b7280' }}>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4 dark:bg-primary-900 dark:border-primary-700">
                <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300 mb-3">
                    Galaxy Hierarchy & Workflow
                </h3>
                <div className="space-y-3">
                    <div className="text-sm text-primary-700 dark:text-primary-400">
                        <strong>Creation Order:</strong>
                        <ol className="list-decimal list-inside mt-1 space-y-1 ml-2">
                            <li>Create <strong>Oversectors</strong> (largest containers) first</li>
                            <li>Add <strong>Sectors</strong> inside specific oversectors</li>
                            <li>Create <strong>Systems</strong> inside specific sectors</li>
                            <li>Add <strong>Planets</strong> inside specific systems</li>
                        </ol>
                    </div>
                    <div className="text-sm text-primary-700 dark:text-primary-400">
                        <strong>To add nested entities:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1 ml-2">
                            <li><strong>Sector:</strong> Select entity type &quot;Sector&quot; → Choose parent oversector</li>
                            <li><strong>System:</strong> Select &quot;System&quot; → Choose oversector → Choose sector from that oversector</li>
                            <li><strong>Planet:</strong> Select &quot;Planet&quot; → Choose oversector → Choose sector → Choose system</li>
                        </ul>
                    </div>
                    <div className="text-sm text-primary-700 dark:text-primary-400">
                        <strong>Visual editing:</strong> Use the main galaxy map to drag and reposition entities after creation.
                    </div>
                </div>
            </div>
        </div>
    );
}