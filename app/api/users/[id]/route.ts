import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { authOptions, hasPermission, Role } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const managerRole = session.user.role as Role;
    if (!hasPermission(managerRole, 'user:manage')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { id } = await params;
        const { role } = await req.json();

        // Super admin cannot be demoted except by another super admin (or maybe not at all in this simple demo)
        // For now, allow any admin/super-admin to change roles

        const [updatedUser] = await db.update(users)
            .set({
                role: role as any,
                updatedAt: new Date()
            })
            .where(eq(users.id, id))
            .returning();

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }
}
