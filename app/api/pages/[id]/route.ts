import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { authOptions, hasPermission, Role } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = session.user.role as Role;
    const { id } = await params;

    try {
        const { title, content, status } = await req.json();

        // Check ownership or admin permissions
        const page = await db.query.pages.findFirst({ where: eq(pages.id, id) });
        if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

        const isOwner = page.createdBy === session.user.id;
        const canEditAny = hasPermission(role, 'page:edit'); // In our setup, editor has page:edit but we check ownership here

        if (!isOwner && role !== 'admin' && role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [updatedPage] = await db.update(pages)
            .set({
                title: title ?? page.title,
                content: content ?? page.content,
                status: status ?? page.status,
                updatedAt: new Date()
            })
            .where(eq(pages.id, id))
            .returning();

        return NextResponse.json(updatedPage);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = session.user.role as Role;
    if (!hasPermission(role, 'page:delete')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { id } = await params;
        await db.delete(pages).where(eq(pages.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }
}
