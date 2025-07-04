import { auth } from "@/auth";

export async function getSession() {
    const session = await auth();
    const status: "authenticated" | "unauthenticated" = session?.user ? 'authenticated' : 'unauthenticated';

    return { session, status };
}