'use server'

import { InventoryType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { generateRandomNumberString } from "@/lib/randomGenerator";

export type InventoryContents = Prisma.InventoryGetPayload<{
    include: {
        items: {
            include: {
                model: true,
            }
        },
        ships: {
            include: {
                model: true,
            }
        },
        vehicles: {
            include: {
                model: true,
            }
        },
    },
}>;

export async function fetchInventoryCounts(ownerId: bigint, type: InventoryType) {
    const where = type === 'CHARACTER' ? { type: type, characterId: ownerId } : { type: type, organizationId: ownerId };

    const[inventory, creditAccount] = await Promise.all([(async () => {
        const check = await prisma.inventory.findUnique({
            where,
            include: {
                items: {
                    include: {
                        model: true,
                    }
                },
                ships: {
                    include: {
                        model: true,
                    }
                },
                vehicles: {
                    include: {
                        model: true,
                    }
                },
            },
        });

        if (check)
            return check;
        return prisma.inventory.create({
            data: where,
            include: {
                items: {
                    include: {
                        model: true,
                    }
                },
                ships: {
                    include: {
                        model: true,
                    }
                },
                vehicles: {
                    include: {
                        model: true,
                    }
                },
            },
        });
    })(), (async () => {
        const check = await prisma.creditAccount.findUnique({
            where,
        });

        if (check)
            return check;
        return createCreditAccount(type, ownerId);
    })()]);

    return { inventory, creditAccount };
}

export async function createCreditAccount(type: InventoryType, ownerId: bigint) {
    const where = type === InventoryType.CHARACTER ? { characterId: ownerId } : { organizationId: ownerId };
    
    // Check if account already exists
    const existingAccount = await prisma.creditAccount.findUnique({
        where,
    });
    
    if (existingAccount) {
        throw new Error(`Credit account already exists for ${type.toLowerCase()} ${ownerId}`);
    }

    const accountNumber = await generateUniqueAccountNumber(type);

    const data = type === InventoryType.CHARACTER ? { type, characterId: ownerId, accountNumber, balance: 0 } : { type, organizationId: ownerId, accountNumber, balance: 0 };

    return prisma.creditAccount.create({
        data,
    });
}

async function generateUniqueAccountNumber(type: InventoryType): Promise<string> {
    const accountNumber = generateRandomNumberString(8);

    const existingAccount = await prisma.creditAccount.findUnique({
        where: {
            type_accountNumber: {
                type,
                accountNumber,
            },
        },
    });

    if (existingAccount) {
        return generateUniqueAccountNumber(type);
    }

    return accountNumber;
}