import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

import { rolePermissions, hasPermission } from './permissions';
import type { Role, Permission } from './permissions';

export { rolePermissions, hasPermission };
export type { Role, Permission };

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as any,
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);
                if (!parsed.success) return null;

                const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
                if (!user || !user.passwordHash) return null;

                const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
                if (!isValid) return null;

                return { id: user.id, email: user.email, name: user.name, role: user.role };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) { token.role = user.role; token.id = user.id; }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as Role;
                session.user.id = token.id as string;
            }
            return session;
        }
    }
};