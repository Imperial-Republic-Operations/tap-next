'use server'

import { prisma } from "@/lib/prisma";
import { Era, RealMonth } from "@/lib/generated/prisma";

let PAGE_SIZE: number = 10;

function isRealMonth(value: string): value is RealMonth {
    return Object.values(RealMonth).includes(value.toUpperCase() as RealMonth);
}

function isEra(value: string): value is Era {
    return Object.values(Era).includes(value as Era);
}

export async function createYear({gameYear, era, current}: {gameYear: number, era: string, current: boolean}) {
    if (isEra(era)) {
        const timeEra: Era = era;
        if (current) {
            await prisma.year.updateMany({
                where: { current: true },
                data: {
                    current: false,
                },
            });
        }
        return prisma.year.create({
            data: {
                gameYear,
                era: timeEra,
                current,
            },
        });
    } else {
        throw new Error(`${era} is not a recognized era...`);
    }
}

export async function fetchMonths() {
    return prisma.month.findMany();
}

export async function fetchMonth(month: string) {
    if (isRealMonth(month)) {
        const realMonth: RealMonth = RealMonth[month.toUpperCase() as keyof typeof RealMonth];
        return prisma.month.findUnique({
            where: { realMonth },
        });
    } else {
        throw new Error(`${month} is not a real month...`);
    }
}

export async function fetchYears(page: number, era?: Era) {
    const skip = page * PAGE_SIZE;

    const where = era ? { era } : {};
    const [years, totalCount] = await Promise.all([
        prisma.year.findMany({
            where,
            skip,
            take: PAGE_SIZE,
            orderBy: {createdAt: 'desc'},
        }),
        prisma.year.count({
            where
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { years, totalPages };
}

export async function fetchCurrentYear() {
    return prisma.year.findFirst({
        where: { current: true },
    });
}

export async function updateMonth(realMonth: RealMonth, gameMonth: string) {
    return prisma.month.update({
        where: { realMonth },
        data: {
            gameMonth,
        }
    })
}

export async function makeYearCurrent(id: bigint) {
    await prisma.year.updateMany({
        where: { current: true },
        data: {
            current: false,
        },
    });
    return prisma.year.update({
        where: { id },
        data: {
            current: true,
        },
    });
}
