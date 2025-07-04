'use server'

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";

let PAGE_SIZE: number = 10;

export type DocumentForList = GameDocumentWithTeamAndAuthor | OrganizationDocumentWithOrganizationTypeAndAuthor | PersonalDocumentWithAuthor;

export type GameDocumentWithTeamAndAuthor = Prisma.GameDocumentGetPayload<{
    include: {
        team: true,
        author: true,
    },
}>;

export type OrganizationDocumentWithOrganizationTypeAndAuthor = Prisma.OrganizationDocumentGetPayload<{
    include: {
        organization: true,
        type: true,
        author: true,
    },
}>;

export type PersonalDocumentWithAuthor = Prisma.PersonalDocumentGetPayload<{
    include: {
        author: true,
    },
}>;

export async function getCodifiedId(type: 'game' | 'organization' | 'personal', id: bigint) {
    let document = null;
    switch (type) {
        case 'game':
            document = await prisma.gameDocument.findUnique({
                where: { id },
                include: {
                    team: true,
                },
            });
            if (!document) return null;

            return `${document.team.abbreviation}-${document.sequenceNumber}`;
        case 'organization':
            document = await prisma.organizationDocument.findUnique({
                where: { id },
                include: {
                    type: true,
                    organization: true,
                },
            });
            if (!document) return null;

            if (document.type.useOrganization) {
                return `${document.type.abbreviation}-${document.organization.abbreviation}-${document.sequenceNumber}`;
            } else {
                return `${document.type.abbreviation}-${document.sequenceNumber}`;
            }
        case 'personal':
            document = await prisma.personalDocument.findUnique({
                where: { id },
                include: {
                    author: true,
                },
            });
            if (!document) return null;

            const initials = document.author.name.split(' ').map(n => n[0]).join('');
            return `JRNL-${initials}-${document.sequenceNumber}`;
    }
}

export async function fetchGameDocuments(page: number) {
    const skip = page * PAGE_SIZE;

    const [documents, totalCount] = await Promise.all([
        prisma.gameDocument.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'desc'},
            include: {
                author: true,
                team: true,
            },
        }),
        prisma.gameDocument.count(),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { documents, totalPages };
}

export async function fetchOrganizationDocuments(charId:bigint, orgId: bigint, page: number) {
    const skip = page * PAGE_SIZE;

    const [documents, totalCount] = await Promise.all([
        prisma.organizationDocument.findMany({
            where: {
                OR: [
                    { organizationId: orgId },
                    { authorId: charId },
                ],
            },
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'desc'},
            include: {
                author: true,
                organization: true,
                type: true,
            },
        }),
        prisma.organizationDocument.count({
            where: {
                OR: [
                    { organizationId: orgId },
                    { authorId: charId },
                ],
            },
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { documents, totalPages };
}

export async function fetchPersonalDocuments(charId: bigint, page: number) {
    const skip = page * PAGE_SIZE;

    const [documents, totalCount] = await Promise.all([
        prisma.personalDocument.findMany({
            where: { authorId: charId },
            skip,
            take: PAGE_SIZE,
            orderBy: {id: 'desc'},
            include: {
                author: true,
            },
        }),
        prisma.personalDocument.count({
            where: { authorId: charId },
        }),
    ]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return { documents, totalPages };
}