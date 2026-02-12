import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import LogoutButton from '@/components/auth/LogoutButton';
import { LayoutDashboard, FileText, Users } from 'lucide-react';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const role = session.user.role;
    const isAdmin = ['admin', 'super_admin'].includes(role);

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
        { label: 'Pages', href: '/dashboard/pages', icon: <FileText /> },
    ];

    if (isAdmin) {
        navItems.push({ label: 'Users', href: '/dashboard/admin/users', icon: <Users /> });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Eshkon
                    </Link>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group"
                        >
                            <span className="text-xl group-hover:scale-102 transition-transform">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {session.user.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate uppercase tracking-tighter">{role.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 md:hidden">
                    <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                        CH
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                            {session.user.name?.[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-end mb-4">
                            <LogoutButton />
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
