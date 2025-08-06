'use client';

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { mapApi } from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { roles, userHasAccess } from "@/lib/roles";

interface MapEntity {
    id: string;
    name: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    color?: string;
    type: 'oversector' | 'sector' | 'system' | 'planet';
    parentId?: string;
    children?: MapEntity[];
}

type GalaxyData = Array<{
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
    sectors: Array<{
        id: string;
        name: string;
        x: number;
        y: number;
        width: number;
        height: number;
        color?: string;
        systems: Array<{
            id: string;
            name: string;
            x: number;
            y: number;
            width: number;
            height: number;
            color?: string;
            planets: Array<{
                id: string;
                name: string;
                x: number;
                y: number;
                radius: number;
                color?: string;
                habitable: boolean;
            }>;
        }>;
    }>;
}>;

export default function GalaxyMapViewer() {
    const svgRef = useRef<SVGSVGElement>(null);
    const { data: session } = useSession();
    const [galaxyData, setGalaxyData] = useState<GalaxyData | null>(null);
    const [selectedEntity, setSelectedEntity] = useState<MapEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState<any>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [editSuccess, setEditSuccess] = useState<string | null>(null);
    const [adminModeEnabled, setAdminModeEnabled] = useState(false);

    const hasAdminPrivileges = session?.user && userHasAccess(roles[4], session.user); // ASSISTANT_ADMIN level
    const isAdmin = hasAdminPrivileges && adminModeEnabled;

    const handleEditClick = () => {
        if (!selectedEntity) return;
        
        setEditFormData({
            name: selectedEntity.name,
            x: selectedEntity.x,
            y: selectedEntity.y,
            width: selectedEntity.width,
            height: selectedEntity.height,
            radius: selectedEntity.radius,
            color: selectedEntity.color || '',
            habitable: (selectedEntity as any).habitable
        });
        setShowEditModal(true);
        setEditError(null);
        setEditSuccess(null);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEntity || !editFormData) return;

        setEditLoading(true);
        setEditError(null);
        setEditSuccess(null);

        try {
            switch (selectedEntity.type) {
                case 'oversector':
                    await mapApi.updateOversector(BigInt(selectedEntity.id), editFormData);
                    break;
                case 'sector':
                    await mapApi.updateSector(BigInt(selectedEntity.id), editFormData);
                    break;
                case 'system':
                    await mapApi.updateSystem(BigInt(selectedEntity.id), editFormData);
                    break;
                case 'planet':
                    await mapApi.updatePlanet(BigInt(selectedEntity.id), editFormData);
                    break;
            }
            
            setEditSuccess(`${selectedEntity.type} updated successfully!`);
            
            // Refresh the map data
            const response = await mapApi.getGalaxyData();
            setGalaxyData(response.data);
            
            // Update the selected entity with new data
            setSelectedEntity({
                ...selectedEntity,
                ...editFormData
            });
            
            // Close modal after a short delay
            setTimeout(() => {
                setShowEditModal(false);
            }, 1000);
            
        } catch (err: any) {
            setEditError(err.message || `Failed to update ${selectedEntity.type}`);
        } finally {
            setEditLoading(false);
        }
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditFormData(null);
        setEditError(null);
        setEditSuccess(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await mapApi.getGalaxyData();
                setGalaxyData(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch galaxy data:', err);
                setError('Failed to load galaxy map data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!galaxyData || !svgRef.current) return;

        // Clear existing content
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current);
        const container = svg.append("g").attr("class", "map-container");

        // Set up zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 10])
            .on("zoom", (event) => {
                container.attr("transform", event.transform);
            });

        svg.call(zoom);

        // Calculate bounds for initial view
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        galaxyData.forEach(oversector => {
            minX = Math.min(minX, oversector.x);
            minY = Math.min(minY, oversector.y);
            maxX = Math.max(maxX, oversector.x + oversector.width);
            maxY = Math.max(maxY, oversector.y + oversector.height);
        });

        // Set initial zoom to fit content
        const width = 800;
        const height = 600;
        const padding = 50;
        
        if (minX < Infinity) {
            const scale = Math.min(
                (width - 2 * padding) / (maxX - minX),
                (height - 2 * padding) / (maxY - minY)
            );
            const translateX = (width - scale * (maxX + minX)) / 2;
            const translateY = (height - scale * (maxY + minY)) / 2;
            
            svg.call(zoom.transform, d3.zoomIdentity
                .translate(translateX, translateY)
                .scale(scale)
            );
        }

        // Render oversectors
        const oversectorGroups = container.selectAll(".oversector")
            .data(galaxyData)
            .enter()
            .append("g")
            .attr("class", "oversector")
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        // Oversector rectangles
        const oversectorRects = oversectorGroups
            .append("rect")
            .attr("width", d => d.width)
            .attr("height", d => d.height)
            .attr("fill", d => d.color || "#e5e7eb")
            .attr("fill-opacity", 0.3)
            .attr("stroke", d => d.color || "#6b7280")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .style("cursor", isAdmin ? "move" : "default")
            .on("click", function(event, d) {
                event.stopPropagation();
                setSelectedEntity({
                    id: d.id,
                    name: d.name,
                    x: d.x,
                    y: d.y,
                    width: d.width,
                    height: d.height,
                    color: d.color,
                    type: 'oversector'
                });
            });

        if (isAdmin) {
            const dragOversector = d3.drag<SVGRectElement, any>()
                .on("start", function(event, d) {
                    d3.select(this).attr("stroke-width", 3);
                })
                .on("drag", function(event, d) {
                    const newX = Math.max(0, d.x + event.dx);
                    const newY = Math.max(0, d.y + event.dy);
                    d.x = newX;
                    d.y = newY;
                    d3.select(this.parentNode as Element).attr("transform", `translate(${newX}, ${newY})`);
                })
                .on("end", async function(event, d) {
                    d3.select(this).attr("stroke-width", 2);
                    try {
                        await mapApi.updateOversector(BigInt(d.id), { x: d.x, y: d.y });
                    } catch (error) {
                        console.error('Failed to update oversector position:', error);
                    }
                });

            oversectorRects.call(dragOversector);
        }

        // Oversector labels
        oversectorGroups
            .append("text")
            .attr("x", d => d.width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "#374151")
            .text(d => d.name);

        // Render sectors
        oversectorGroups.each(function(oversectorData) {
            const oversectorGroup = d3.select(this);
            
            const sectorGroups = oversectorGroup.selectAll(".sector")
                .data(oversectorData.sectors)
                .enter()
                .append("g")
                .attr("class", "sector")
                .attr("transform", d => `translate(${d.x}, ${d.y})`);

            // Sector rectangles
            const sectorRects = sectorGroups
                .append("rect")
                .attr("width", d => d.width)
                .attr("height", d => d.height)
                .attr("fill", d => d.color || "#f3f4f6")
                .attr("fill-opacity", 0.5)
                .attr("stroke", d => d.color || "#9ca3af")
                .attr("stroke-width", 1.5)
                .style("cursor", isAdmin ? "move" : "default")
                .on("click", function(event, d) {
                    event.stopPropagation();
                    setSelectedEntity({
                        id: d.id,
                        name: d.name,
                        x: d.x,
                        y: d.y,
                        width: d.width,
                        height: d.height,
                        color: d.color,
                        type: 'sector',
                        parentId: oversectorData.id
                    });
                });

            if (isAdmin) {
                const dragSector = d3.drag<SVGRectElement, any>()
                    .on("start", function(event, d) {
                        d3.select(this).attr("stroke-width", 2.5);
                    })
                    .on("drag", function(event, d) {
                        const newX = Math.max(0, Math.min(oversectorData.width - d.width, d.x + event.dx));
                        const newY = Math.max(0, Math.min(oversectorData.height - d.height, d.y + event.dy));
                        d.x = newX;
                        d.y = newY;
                        d3.select(this.parentNode as Element).attr("transform", `translate(${newX}, ${newY})`);
                    })
                    .on("end", async function(event, d) {
                        d3.select(this).attr("stroke-width", 1.5);
                        try {
                            await mapApi.updateSector(BigInt(d.id), { x: d.x, y: d.y });
                        } catch (error) {
                            console.error('Failed to update sector position:', error);
                        }
                    });

                sectorRects.call(dragSector);
            }

            // Sector labels
            sectorGroups
                .append("text")
                .attr("x", d => d.width / 2)
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", "#4b5563")
                .text(d => d.name);

            // Render systems
            sectorGroups.each(function(sectorData) {
                const sectorGroup = d3.select(this);
                
                const systemGroups = sectorGroup.selectAll(".system")
                    .data(sectorData.systems)
                    .enter()
                    .append("g")
                    .attr("class", "system")
                    .attr("transform", d => `translate(${d.x}, ${d.y})`);

                // System rectangles
                const systemRects = systemGroups
                    .append("rect")
                    .attr("width", d => d.width)
                    .attr("height", d => d.height)
                    .attr("fill", d => d.color || "#fbbf24")
                    .attr("fill-opacity", 0.7)
                    .attr("stroke", d => d.color || "#f59e0b")
                    .attr("stroke-width", 1)
                    .style("cursor", isAdmin ? "move" : "default")
                    .on("click", function(event, d) {
                        event.stopPropagation();
                        setSelectedEntity({
                            id: d.id,
                            name: d.name,
                            x: d.x,
                            y: d.y,
                            width: d.width,
                            height: d.height,
                            color: d.color,
                            type: 'system',
                            parentId: sectorData.id
                        });
                    });

                if (isAdmin) {
                    const dragSystem = d3.drag<SVGRectElement, any>()
                        .on("start", function(event, d) {
                            d3.select(this).attr("stroke-width", 1.5);
                        })
                        .on("drag", function(event, d) {
                            const newX = Math.max(0, Math.min(sectorData.width - d.width, d.x + event.dx));
                            const newY = Math.max(0, Math.min(sectorData.height - d.height, d.y + event.dy));
                            d.x = newX;
                            d.y = newY;
                            d3.select(this.parentNode as Element).attr("transform", `translate(${newX}, ${newY})`);
                        })
                        .on("end", async function(event, d) {
                            d3.select(this).attr("stroke-width", 1);
                            try {
                                await mapApi.updateSystem(BigInt(d.id), { x: d.x, y: d.y });
                            } catch (error) {
                                console.error('Failed to update system position:', error);
                            }
                        });

                    systemRects.call(dragSystem);
                }

                // System labels
                systemGroups
                    .append("text")
                    .attr("x", d => d.width / 2)
                    .attr("y", d => d.height / 2 + 4)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "10px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#1f2937")
                    .text(d => d.name);

                // Render planets
                systemGroups.each(function(systemData) {
                    const systemGroup = d3.select(this);
                    
                    const planetCircles = systemGroup.selectAll(".planet")
                        .data(systemData.planets)
                        .enter()
                        .append("circle")
                        .attr("class", "planet")
                        .attr("cx", d => d.x)
                        .attr("cy", d => d.y)
                        .attr("r", d => d.radius)
                        .attr("fill", d => d.color || (d.habitable ? "#10b981" : "#6b7280"))
                        .attr("stroke", "#1f2937")
                        .attr("stroke-width", 0.5)
                        .style("cursor", isAdmin ? "move" : "default")
                        .on("click", function(event, d) {
                            event.stopPropagation();
                            setSelectedEntity({
                                id: d.id,
                                name: d.name,
                                x: d.x,
                                y: d.y,
                                radius: d.radius,
                                color: d.color,
                                type: 'planet',
                                parentId: systemData.id
                            });
                        });

                    // Add tooltips
                    planetCircles.append("title")
                        .text(d => `${d.name}${d.habitable ? ' (Habitable)' : ' (Uninhabitable)'}`);

                    if (isAdmin) {
                        const dragPlanet = d3.drag<SVGCircleElement, any>()
                            .on("start", function(event, d) {
                                d3.select(this).attr("stroke-width", 1);
                            })
                            .on("drag", function(event, d) {
                                const newX = Math.max(d.radius, Math.min(systemData.width - d.radius, d.x + event.dx));
                                const newY = Math.max(d.radius, Math.min(systemData.height - d.radius, d.y + event.dy));
                                d.x = newX;
                                d.y = newY;
                                d3.select(this)
                                    .attr("cx", newX)
                                    .attr("cy", newY);
                            })
                            .on("end", async function(event, d) {
                                d3.select(this).attr("stroke-width", 0.5);
                                try {
                                    await mapApi.updatePlanet(BigInt(d.id), { x: d.x, y: d.y });
                                } catch (error) {
                                    console.error('Failed to update planet position:', error);
                                }
                            });

                        planetCircles.call(dragPlanet);
                    }
                });
            });
        });

        // Clear selection when clicking the empty space
        svg.on("click", () => {
            setSelectedEntity(null);
        });

    }, [galaxyData, isAdmin]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading galaxy map...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-red-600 dark:text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Interactive Galaxy Map
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Use mouse wheel to zoom, drag to pan{isAdmin ? ', drag entities to reposition' : ''}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {hasAdminPrivileges && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={adminModeEnabled}
                                onChange={(e) => setAdminModeEnabled(e.target.checked)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Admin Mode
                            </span>
                        </label>
                    )}
                    {isAdmin && (
                        <div className="text-sm text-primary-600 dark:text-primary-400">
                            Click entities to select and edit
                        </div>
                    )}
                </div>
            </div>

            <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                <svg
                    ref={svgRef}
                    width="100%"
                    height="600"
                    className="block"
                    style={{ minHeight: '600px' }}
                />
                
                {selectedEntity && (
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-xs">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {selectedEntity.name}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <div>Type: {selectedEntity.type}</div>
                            <div>Position: ({selectedEntity.x}, {selectedEntity.y})</div>
                            {selectedEntity.width && (
                                <div>Size: {selectedEntity.width} × {selectedEntity.height}</div>
                            )}
                            {selectedEntity.radius && (
                                <div>Radius: {selectedEntity.radius}</div>
                            )}
                        </div>
                        {isAdmin && (
                            <button 
                                onClick={handleEditClick}
                                className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-3 py-2 rounded-md shadow-sm transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                            >
                                Edit Properties
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-dashed bg-gray-200 bg-opacity-30"></div>
                    <span className="text-gray-600 dark:text-gray-400">Oversectors</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-gray-400 bg-gray-300 bg-opacity-50"></div>
                    <span className="text-gray-600 dark:text-gray-400">Sectors</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-yellow-500 bg-yellow-400 bg-opacity-70"></div>
                    <span className="text-gray-600 dark:text-gray-400">Systems</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Habitable Planets</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Uninhabitable Planets</span>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedEntity && editFormData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Edit {selectedEntity.type}: {selectedEntity.name}
                        </h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        X Position
                                    </label>
                                    <input
                                        type="number"
                                        value={editFormData.x}
                                        onChange={(e) => setEditFormData({ ...editFormData, x: Number(e.target.value) })}
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
                                        value={editFormData.y}
                                        onChange={(e) => setEditFormData({ ...editFormData, y: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {selectedEntity.type === 'planet' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Radius
                                    </label>
                                    <input
                                        type="number"
                                        value={editFormData.radius || 5}
                                        onChange={(e) => setEditFormData({ ...editFormData, radius: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        min="1"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Width
                                        </label>
                                        <input
                                            type="number"
                                            value={editFormData.width || 100}
                                            onChange={(e) => setEditFormData({ ...editFormData, width: Number(e.target.value) })}
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
                                            value={editFormData.height || 100}
                                            onChange={(e) => setEditFormData({ ...editFormData, height: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={editFormData.color || '#e5e7eb'}
                                    onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value })}
                                    className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600"
                                />
                            </div>

                            {selectedEntity.type === 'planet' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Habitable
                                    </label>
                                    <select
                                        value={editFormData.habitable ? 'true' : 'false'}
                                        onChange={(e) => setEditFormData({ ...editFormData, habitable: e.target.value === 'true' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="true">Habitable</option>
                                        <option value="false">Uninhabitable</option>
                                    </select>
                                </div>
                            )}

                            {editError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300">
                                    {editError}
                                </div>
                            )}

                            {editSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300">
                                    {editSuccess}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                                >
                                    {editLoading ? 'Updating...' : 'Update'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}