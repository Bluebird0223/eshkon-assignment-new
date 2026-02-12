const { neon } = require('@neondatabase/serverless');

const url = 'postgresql://neondb_owner:npg_lgsnGrbI4Ea2@ep-fragrant-rain-a1zxr7z5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function test() {
    try {
        const sql = neon(url);
        const result = await sql`SELECT 1 as test`;
        console.log('Connection successful:', result);
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

test();
