import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { authOptions, hasPermission, Role } from '@/lib/auth';
import PageEditorClient from './PageEditorClient';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    const page = await db.query.pages.findFirst({
        where: eq(pages.id, id)
    });

    if (!page) notFound();

    // Protection
    const role = session.user.role as Role;
    if (role === 'editor' && page.createdBy !== session.user.id) {
        redirect('/dashboard/pages');
    }

    if (!hasPermission(role, 'page:edit')) {
        redirect('/dashboard/pages');
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <PageEditorClient initialPage={page} userRole={role} />
        </div>
    );
}
