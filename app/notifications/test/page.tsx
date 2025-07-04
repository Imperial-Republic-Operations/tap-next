import { getSession } from "@/lib/auth";
import { roles, userHasAccess } from "@/lib/roles";
import { notFound } from "next/navigation";
import DevNotificationTester from "@/app/notifications/test/_components/DevNotificationTester";

export default async function TestNotificationPage() {
    const {session} = await getSession();

    if (process.env.NODE_ENV === 'production' || !userHasAccess(roles[6], session?.user)) notFound();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dev Notification Tester</h1>
            <DevNotificationTester userId={session!.user!.id!} />
        </div>
    );
}