import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (typeof window !== 'undefined') {
    throw new Error('❌ DATABASE ACCESS ATTEMPTED ON CLIENT SIDE. This is a security risk and is not supported.');
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        '❌ DATABASE_URL is not defined in process.env. ' +
        'Please check your .env.local file.'
    );
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

export type DB = typeof db;