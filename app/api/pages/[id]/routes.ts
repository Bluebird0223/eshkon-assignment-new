import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { authOptions, hasPermission, Role } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { content, status, version } = body;

    const existingPage = await db.query.pages.findFirst({ where: eq(pages.id, params.id) });
    if (!existingPage) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Permission checks
    if (status === 'published' && !hasPermission(session.user.role as Role, 'page:publish')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (session.user.role === 'editor' && existingPage.createdBy !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [updated] = await db.update(pages)
        .set({
            content,
            status,
            version,
            updatedAt: new Date(),
            publishedAt: status === 'published' ? new Date() : existingPage.publishedAt
        })
        .where(eq(pages.id, params.id))
        .returning();

    return NextResponse.json(updated);
}