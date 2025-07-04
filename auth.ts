import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@/lib/generated/prisma";
import Role = $Enums.Role;

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [{
        id: "nexus",
        name: "EOTIR Nexus",
        type: "oauth",
        authorization: {
            url: "https://nexus.eotir.dev/oauth/authorize/",
            params: { scope: "profile email" }
        },
        token: "https://nexus.eotir.dev/oauth/token/",
        userinfo: "https://nexus.eotir.dev/api/core/me",
        client: {
            token_endpoint_auth_method: "client_secret_post"
        },
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        profile(profile: any) {
            const isLeadAdmin = process.env.LEAD_ADMIN && profile.primaryGroup.id === parseInt(process.env.LEAD_ADMIN);
            const isSeniorAdmin = process.env.SENIOR_ADMIN && profile.primaryGroup.id === parseInt(process.env.SENIOR_ADMIN);
            const isAdmin = process.env.ADMIN && profile.primaryGroup.id === parseInt(process.env.ADMIN);
            const isStaff = process.env.STAFF && profile.primaryGroup.id === parseInt(process.env.STAFF);
            return {
                username: profile.name,
                name: profile.name,
                email: profile.email,
                image: profile.photoUrl,
                role: isLeadAdmin || isSeniorAdmin ? Role.SYSTEM_ADMIN : isAdmin ? Role.ASSISTANT_ADMIN : isStaff ? Role.STAFF : Role.PLAYER,
                nexusId: profile.id,
            };
        },
    }],
    callbacks: {
        async session({ session, user }) {
            session.user.role = user.role;
            return {
                ...session,
                user: {
                    ...session.user,
                    nexusId: user.nexusId?.toString(),
                    role: user.role
                }
            };
        },
        /*async signIn({ user }) {
            const settings = await prisma.userSettings.findUnique({
                where: { userId: user.id },
            });

            if (!settings) {
                await prisma.userSettings.create({
                    data: {
                        user: {
                            connect: { id: user.id }
                        }
                    }
                })
            }

            return true;
        },*/
    },
    adapter: PrismaAdapter(prisma),
    debug: true,
    events: {
        async createUser({ user }) {
            const settings = await prisma.userSettings.findUnique({
                where: { userId: user.id },
            });

            if (!settings) {
                await prisma.userSettings.create({
                    data: {
                        user: {
                            connect: { id: user.id }
                        }
                    }
                })
            }
        }
    },
});