// types/next-auth.d.ts (or next-auth.d.ts in your root)
import { DefaultSession } from "next-auth"
import { $Enums } from "@/lib/generated/prisma"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: $Enums.Role
            nexusId?: string
        } & DefaultSession["user"]
    }

    interface User {
        role: $Enums.Role
        nexusId?: string
        // Add any other custom fields from your User model
    }
}