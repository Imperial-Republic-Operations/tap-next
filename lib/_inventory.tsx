'use server'

import { InventoryType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

export type InventoryContents = Prisma.InventoryGetPayload<{
    include: {
        items: true,
        ships: true,
        vehicles: true,
    },
}>;

export async function fetchInventoryCounts(ownerId: bigint, type: InventoryType) {
    const where = type === 'CHARACTER' ? { type: type, characterId: ownerId } : { type: type, organizationId: ownerId };

    const[inventory, creditAccount] = await Promise.all([
        prisma.inventory.findUnique({
            where: where,
            include: {
                items: true,
                ships: true,
                vehicles: true,
            },
        }),
        prisma.creditAccount.findUnique({
            where: where,
        }),
    ]);

    return { inventory, creditAccount };
}