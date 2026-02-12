import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { pages, users } from '@/lib/db/schema';
import { count, eq, sql } from 'drizzle-orm';
import { authOptions, Role } from '@/lib/auth';


export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const role = session.user.role as Role;
    const isAdmin = ['admin', 'super_admin'].includes(role);

    // Fetch stats
    const [pagesCount] = await db.select({ value: count() }).from(pages);
    const [publishedCount] = await db.select({ value: count() }).from(pages).where(eq(pages.status, 'published'));
    const [draftCount] = await db.select({ value: count() }).from(pages).where(eq(pages.status, 'draft'));

    let userStats = null;
    if (isAdmin) {
        const [totalUsers] = await db.select({ value: count() }).from(users);
        const roles = await db.select({
            role: users.role,
            count: count()
        }).from(users).groupBy(users.role);

        userStats = {
            total: totalUsers.value,
            roles: roles
        };
    }

    const cards = [
        { label: 'Total Pages', value: pagesCount.value },
        { label: 'Published', value: publishedCount.value },
        { label: 'Drafts', value: draftCount.value },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Dashboard Summary
                </h1>
                <p className="text-gray-500 mt-2">Welcome back, {session.user.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                            <p className="text-4xl font-bold mt-2 text-gray-900">{card.value}</p>
                        </div>
                        {/* <div className="flex justify-between items-center">

                        </div> */}
                    </div>
                ))}
            </div>

            {isAdmin && userStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg text-black font-bold mb-4">User Statistics</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <span className="font-medium text-gray-900">Total Users</span>
                                <span className="text-2xl font-bold text-gray-900">{userStats.total}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {userStats.roles.map((r) => (
                                    <div key={r.role} className="p-3 border rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase text-gray-900">{r.role.replace('_', ' ')}</p>
                                        <p className="text-xl font-bold text-gray-900">{r.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg text-black font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/dashboard/pages" className="flex items-center gap-3 p-3 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200">📄</div>
                                    <span className="font-medium">Manage Pages</span>
                                </Link>
                                <Link href="/dashboard/admin/users" className="flex items-center gap-3 p-3 hover:bg-purple-50 text-purple-600 rounded-xl transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200">👥</div>
                                    <span className="font-medium">Manage Users</span>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t">
                            <Link href="/dashboard/pages/new" className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                Create New Page
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {!isAdmin && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-2">Ready to create?</h2>
                    <p className="mb-6 opacity-90 text-blue-100">Start building your next masterpiece today.</p>
                    <Link href="/dashboard/pages" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                        View My Pages
                    </Link>
                </div>
            )}
        </div>
    );
}
