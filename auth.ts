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
        allowDangerousEmailAccountLinking: true,
        authorization: {
            url: `${process.env.NEXT_PUBLIC_NEXUS_URL}/oauth/authorize/`,
            params: { scope: "profile email" }
        },
        token: `${process.env.NEXT_PUBLIC_NEXUS_URL}/oauth/token/`,
        userinfo: `${process.env.NEXT_PUBLIC_NEXUS_URL}/api/core/me`,
        client: {
            token_endpoint_auth_method: "client_secret_post"
        },
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        profile(profile: any) {
            console.log("Profile data from Nexus:", profile);

            const isLeadAdmin = process.env.LEAD_ADMIN && profile.primaryGroup?.id === parseInt(process.env.LEAD_ADMIN);
            const isSeniorAdmin = process.env.SENIOR_ADMIN && profile.primaryGroup?.id === parseInt(process.env.SENIOR_ADMIN);
            const isAdmin = process.env.ADMIN && profile.primaryGroup?.id === parseInt(process.env.ADMIN);
            const isStaff = process.env.STAFF && profile.primaryGroup?.id === parseInt(process.env.STAFF);

            return {
                username: profile.name,
                name: profile.name,
                email: profile.email,
                image: profile.photoUrl,
                nexusId: profile.id.toString(), // Required field!
                role: isLeadAdmin || isSeniorAdmin ? Role.SYSTEM_ADMIN : isAdmin ? Role.ASSISTANT_ADMIN : isStaff ? Role.STAFF : Role.PLAYER,
            };
        },
    }],
    callbacks: {
        async session({session, user}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                    nexusId: user.nexusId?.toString(),
                    role: user.role,
                    username: user.username
                }
            };
        },
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