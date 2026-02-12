import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { authOptions, hasPermission, Role } from '@/lib/auth';
import UserRoleManager from './UserRoleManager';

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    if (!hasPermission(session.user.role as Role, 'user:manage')) {
        redirect('/dashboard');
    }

    const allUsers = await db.select().from(users);

    const roleBadges = {
        viewer: 'bg-gray-100 text-gray-700 border-gray-200',
        editor: 'bg-blue-100 text-blue-700 border-blue-200',
        admin: 'bg-purple-100 text-purple-700 border-purple-200',
        super_admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage user roles and system permissions.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Current Role</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                                            {user.name?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${roleBadges[user.role as keyof typeof roleBadges]}`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-black text-center">
                                    <UserRoleManager userId={user.id} currentRole={user.role} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
