'use server';

import { prisma } from "@/lib/prisma";

export async function getBreadcrumbTitle(base: string, id: bigint): Promise<string> {
    console.log("Base", base);
    console.log("ID", id);
    let result = undefined;
    switch (base) {
        case "characters":
            result = await prisma.character.findUnique({
                where: { id: id },
                select: { name: true },
            });
            return result?.name ?? `ID: ${id}`;
        case "organizations":
            result = await prisma.organization.findUnique({
                where: { id: id },
                select: { name: true },
            });
            return result?.name ?? `ID: ${id}`;
        case "profile":
        case "users":
            result = await prisma.user.findUnique({
                where: { nexusId: id },
                select: { name: true },
            });
            return result?.name ?? `ID: ${id}`;
        default:
            return `ID: ${id}`;

    }
}

export async function getBreadcrumbTitleByType(base: string, type: string, id: bigint): Promise<string> {
    let result = undefined;
    const typeWord = type.charAt(0).toUpperCase() + type.substring(1).toLowerCase();
    switch (base) {
        case "documents":
            switch (type) {
                case "game":
                    result = await prisma.gameDocument.findUnique({
                        where: { id: id },
                        select: { title: true },
                    });
                    return result?.title ?? `Type: ${typeWord}; ID: ${id}`;
                case "organization":
                    result = await prisma.organizationDocument.findUnique({
                        where: { id: id },
                        select: { title: true },
                    });
                    return result?.title ?? `Type: ${typeWord}; ID: ${id}`;
                case "personal":
                    result = await prisma.personalDocument.findUnique({
                        where: { id: id },
                        select: { title: true },
                    });
                    return result?.title ?? `Type: ${typeWord}; ID: ${id}`;
                default:
                    return `Type: ${typeWord}; ID: ${id}`;
            }
        default:
            return `Type: ${typeWord}; ID: ${id}`;
    }
}