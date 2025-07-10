import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: process.env.BUILD_VERSION || 'unknown',
            environment: process.env.NODE_ENV,
            database: 'connected',
        });
    } catch (e: any) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: e.message,
            database: 'disconnected',
        }, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}