import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NotificationsList from "@/app/notifications/_components/NotificationsList";

export default async function NotificationsPage() {
  const { session } = await getSession();

  if (!session?.user) redirect('/');

  return (
      <div className="max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 pb-5 mb-5 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        </div>

        <NotificationsList userId={session.user.id!} />
      </div>
  );
}