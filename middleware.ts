import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { hasPermission, type Role } from './lib/auth';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role as Role;

        // API protection
        if (path.startsWith('/api')) {
            if (path.startsWith('/api/pages') && req.method === 'POST' && !hasPermission(role, 'page:create')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            if (path.startsWith('/api/pages') && req.method === 'PUT' && !hasPermission(role, 'page:edit')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            if (path.includes('/publish') && !hasPermission(role, 'page:publish')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            if (path.startsWith('/api/users') && !hasPermission(role, 'user:manage')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        // Page protection
        if (path.startsWith('/dashboard/admin') && !['admin', 'super_admin'].includes(role)) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: { authorized: ({ token }) => !!token }
    }
);

export const config = { matcher: ['/dashboard/:path*', '/api/:path*'] };