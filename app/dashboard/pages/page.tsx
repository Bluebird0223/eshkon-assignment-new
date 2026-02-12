import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { authOptions, hasPermission, Role } from '@/lib/auth';
import { Link2 } from 'lucide-react';

export default async function PagesPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const role = session.user.role as Role;
    let userPages = [];

    if (role === 'editor') {
        userPages = await db.select().from(pages)
            .where(and(
                eq(pages.createdBy, session.user.id),
                eq(pages.status, 'draft')
            ))
            .orderBy(desc(pages.updatedAt));
    } else {
        userPages = await db.select().from(pages)
            .orderBy(desc(pages.updatedAt));
    }

    const statusColors = {
        draft: 'bg-gray-100 text-gray-700 border-gray-200',
        preview: 'bg-blue-100 text-blue-700 border-blue-200',
        published: 'bg-green-100 text-green-700 border-green-200',
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Pages</h1>
                    <p className="text-sm text-gray-500">Manage and organize your site's content.</p>
                </div>
                {hasPermission(role, 'page:create') && (
                    <Link href="/dashboard/pages/new" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2">
                        <span>+</span> New Page
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {userPages.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-black">No pages found. Start by creating one!</p>
                    </div>
                ) : (
                    userPages.map(page => (
                        <div key={page.id} className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                                    📄
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{page.title}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusColors[page.status as keyof typeof statusColors]}`}>
                                            {page.status}
                                        </span>
                                        <span className="text-xs text-black">
                                            Last updated {new Date(page.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {hasPermission(role, 'page:view') && (
                                    <Link href={`/pages/${page.slug}`} target="_blank" className="p-2 text-black hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all" title="View Public Page">
                                        <Link2 className="w-6 h-6" />
                                    </Link>
                                )}
                                {hasPermission(role, 'page:edit') && (
                                    <Link href={`/dashboard/pages/${page.id}/edit`}
                                        className="px-4 py-2 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                        Edit
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
