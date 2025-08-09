import { getSession } from '@/lib/auth';
import { roles, userHasAccess } from '@/lib/roles';
import { redirect } from 'next/navigation';

export default async function SystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { session } = await getSession();
    
    if (!session?.user?.id) {
        redirect('/auth/signin');
    }
    
    if (!userHasAccess(roles[6], session.user)) {
        redirect('/dashboard');
    }
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        System Settings
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Configure system-wide settings and administrative options.
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
}