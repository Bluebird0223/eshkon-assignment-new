import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { hashPassword } from '../lib/auth';
import fs from 'fs';
import path from 'path';

// Manual .env loader since dotenv is not a direct dependency
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.join('=').trim();
            }
        });
    }
}

async function seed() {
    loadEnv();
    console.log('Seeding users with DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'MISSING');
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing in .env');
        process.exit(1);
    }

    const testUsers = [
        {
            email: 'super@example.com',
            name: 'Super Admin',
            role: 'super_admin' as const,
            password: 'password123'
        },
        {
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin' as const,
            password: 'password123'
        },
        {
            email: 'editor@example.com',
            name: 'Editor User',
            role: 'editor' as const,
            password: 'password123'
        },
        {
            email: 'viewer@example.com',
            name: 'Viewer User',
            role: 'viewer' as const,
            password: 'password123'
        }
    ];

    for (const u of testUsers) {
        const passwordHash = await hashPassword(u.password);
        await db.insert(users).values({
            email: u.email,
            name: u.name,
            role: u.role,
            passwordHash,
        }).onConflictDoNothing();
    }

    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
