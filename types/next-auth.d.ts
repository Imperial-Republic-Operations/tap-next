import NextAuth from "next-auth"
import { Role } from "@/lib/generated/prisma"

declare module "next-auth" {
  interface User {
    username: string
    nexusId: bigint
    role: Role
  }

  interface Session {
    user: {
      id: string
      username: string
      role: Role
      nexusId?: string
    } & DefaultSession["user"]
  }
}