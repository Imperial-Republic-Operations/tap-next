import { prisma } from "@/lib/prisma";
import { getServerTranslations } from "@/lib/i18nServer";

export type BreadcrumbResolver = (params: Record<string, string>, userId?: string) => Promise<string>;

export const breadcrumbResolvers: Record<string, BreadcrumbResolver> = {
    character_name: async (params: Record<string, string>) => {
        const id = params.id;
        if (!id) return 'Character';

        const character = await prisma.character.findUnique({
            where: { id: BigInt(id) },
            select: { name: true }
        });

        return character?.name || 'Character';
    },

    organization_name: async (params: Record<string, string>) => {
        const id = params.id;
        if (!id) return 'Organization';

        const org = await prisma.organization.findUnique({
            where: { id: BigInt(id) },
            select: { name: true }
        });

        return org?.name || 'Organization';
    },

    view_document_title: async (params: Record<string, string>, userId?: string) => {
        const t = await getServerTranslations(userId);
        
        const type = params.type;
        const id = params.id;
        if (!id || !type) return `${t.breadcrumb.viewing} Document`;

        let result = undefined;
        switch (type) {
            case 'game':
                result = await prisma.gameDocument.findUnique({
                    where: { id: BigInt(id) },
                    select: { title: true },
                });
                return `${t.breadcrumb.viewing} ${result?.title ?? `Game Document ${id}`}`;
            case 'organization':
                result = await prisma.organizationDocument.findUnique({
                    where: { id: BigInt(id) },
                    select: { title: true },
                });
                return `${t.breadcrumb.viewing} ${result?.title ?? `Organization Document ${id}`}`;
            case 'personal':
                result = await prisma.personalDocument.findUnique({
                    where: { id: BigInt(id) },
                    select: { title: true },
                });
                return `${t.breadcrumb.viewing} ${result?.title ?? `Personal Document ${id}`}`;
            default:
                return `${t.breadcrumb.viewing} Document ${id}`;
        }
    }
};