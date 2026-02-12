import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { authOptions, hasPermission, Role } from '@/lib/auth';
import { slugify } from '@/lib/utils/slugify';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = session.user.role as Role;
    if (!hasPermission(role, 'page:create')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { title, content } = await req.json();
        const slug = slugify(title);

        // if page with same slug exists, return error
        const existingPage = await db.select().from(pages).where(eq(pages.slug, slug));
        if (existingPage.length > 0) {
            return NextResponse.json({ error: 'Page with same slug exists' }, { status: 400 });
        }

        const [newPage] = await db.insert(pages).values({
            title,
            slug,
            content: content || { type: 'doc', content: [] },
            status: 'draft',
            createdBy: session.user.id,
        }).returning();

        return NextResponse.json(newPage);
    } catch (error) {
        console.error('Failed to create page:', error);
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const allPages = await db.select().from(pages);
        return NextResponse.json(allPages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
}
