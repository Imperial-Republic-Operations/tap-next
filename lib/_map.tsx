'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

// Type definitions for map data with nested relationships
export type MapOversector = Prisma.OversectorGetPayload<{
    include: {
        sectors: {
            include: {
                systems: {
                    include: {
                        planets: true
                    }
                }
            }
        }
    }
}>;

export type MapSector = Prisma.SectorGetPayload<{
    include: {
        systems: {
            include: {
                planets: true
            }
        }
    }
}>;

export type MapSystem = Prisma.SystemGetPayload<{
    include: {
        planets: true
    }
}>;

export type MapPlanet = Prisma.PlanetGetPayload<object>;

/**
 * Fetch all oversectors with their complete nested hierarchy
 * This returns the full galaxy map data for visualization
 */
export async function fetchGalaxyMapData() {
    return await prisma.oversector.findMany({
        include: {
            sectors: {
                include: {
                    systems: {
                        include: {
                            planets: true
                        }
                    }
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
}

/**
 * Fetch all oversectors (top level only)
 */
export async function fetchOversectors() {
    return await prisma.oversector.findMany({
        orderBy: {
            name: 'asc'
        }
    });
}

/**
 * Fetch a specific oversector with its sectors
 */
export async function fetchOversectorWithSectors(oversectorId: bigint) {
    return await prisma.oversector.findUnique({
        where: { id: oversectorId },
        include: {
            sectors: {
                orderBy: {
                    name: 'asc'
                }
            }
        }
    });
}

/**
 * Fetch sectors for a specific oversector
 */
export async function fetchSectorsForOversector(oversectorId: bigint) {
    return await prisma.sector.findMany({
        where: {
            oversectorId: oversectorId
        },
        include: {
            systems: {
                include: {
                    planets: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
}

/**
 * Fetch a specific sector with its systems
 */
export async function fetchSectorWithSystems(sectorId: bigint) {
    return await prisma.sector.findUnique({
        where: { id: sectorId },
        include: {
            systems: {
                include: {
                    planets: true
                },
                orderBy: {
                    name: 'asc'
                }
            }
        }
    });
}

/**
 * Fetch systems for a specific sector
 */
export async function fetchSystemsForSector(sectorId: bigint) {
    return await prisma.system.findMany({
        where: {
            sectorId: sectorId
        },
        include: {
            planets: true
        },
        orderBy: {
            name: 'asc'
        }
    });
}

/**
 * Fetch a specific system with its planets
 */
export async function fetchSystemWithPlanets(systemId: bigint) {
    return await prisma.system.findUnique({
        where: { id: systemId },
        include: {
            planets: {
                orderBy: {
                    name: 'asc'
                }
            }
        }
    });
}

/**
 * Fetch planets for a specific system
 */
export async function fetchPlanetsForSystem(systemId: bigint) {
    return await prisma.planet.findMany({
        where: {
            systemId: systemId
        },
        orderBy: {
            name: 'asc'
        }
    });
}

/**
 * Create a new oversector
 */
export async function createOversector(data: {
    name: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
}) {
    return await prisma.oversector.create({
        data: {
            name: data.name,
            x: data.x ?? 0,
            y: data.y ?? 0,
            width: data.width ?? 1000,
            height: data.height ?? 1000,
            color: data.color,
        }
    });
}

/**
 * Create a new sector
 */
export async function createSector(data: {
    name: string;
    oversectorId: bigint;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
}) {
    return await prisma.sector.create({
        data: {
            name: data.name,
            oversectorId: data.oversectorId,
            x: data.x ?? 0,
            y: data.y ?? 0,
            width: data.width ?? 200,
            height: data.height ?? 200,
            color: data.color,
        }
    });
}

/**
 * Create a new system
 */
export async function createSystem(data: {
    name: string;
    sectorId: bigint;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
}) {
    return await prisma.system.create({
        data: {
            name: data.name,
            sectorId: data.sectorId,
            x: data.x ?? 0,
            y: data.y ?? 0,
            width: data.width ?? 50,
            height: data.height ?? 50,
            color: data.color,
        }
    });
}

/**
 * Create a new planet
 */
export async function createPlanet(data: {
    name: string;
    systemId: bigint;
    x?: number;
    y?: number;
    radius?: number;
    color?: string;
    habitable?: boolean;
    forceProbabilityModifier?: number;
}) {
    return await prisma.planet.create({
        data: {
            name: data.name,
            systemId: data.systemId,
            x: data.x ?? 0,
            y: data.y ?? 0,
            radius: data.radius ?? 5,
            color: data.color,
            habitable: data.habitable ?? true,
            forceProbabilityModifier: data.forceProbabilityModifier ?? 1.0,
        }
    });
}

/**
 * Update oversector position and properties
 */
export async function updateOversector(id: bigint, data: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
}) {
    return await prisma.oversector.update({
        where: { id },
        data
    });
}

/**
 * Update sector position and properties
 */
export async function updateSector(id: bigint, data: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
}) {
    return await prisma.sector.update({
        where: { id },
        data
    });
}

/**
 * Update system position and properties
 */
export async function updateSystem(id: bigint, data: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
}) {
    return await prisma.system.update({
        where: { id },
        data
    });
}

/**
 * Update planet position and properties
 */
export async function updatePlanet(id: bigint, data: {
    name?: string;
    x?: number;
    y?: number;
    radius?: number;
    color?: string;
    habitable?: boolean;
    forceProbabilityModifier?: number;
}) {
    return await prisma.planet.update({
        where: { id },
        data
    });
}