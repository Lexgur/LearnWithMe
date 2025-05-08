import { faker } from '@faker-js/faker';
import { createPool } from 'mysql2/promise';

(async () => {
    console.log('Seeding database...');

    try {
        const pool = createPool({
            host: 'localhost',
            user: 'root',
            password: 'root123',
            database: 'learnwme',
            waitForConnections: true,
        });

        const con = await pool.getConnection();
        console.log('Connected to database.');

        let sql;
        // TABLE DROPS
        const drops = [
            'sessions',
            'payments',
            'part_contents',
            'parts',
            'reviews',
            'certificates',
            'user_courses',
            'courses',
            'topics',
            'users'
        ];

        for (const table of drops) {
            const sql = `DROP TABLE IF EXISTS \`${table}\``;
            await con.query(sql);
            console.log(`Dropped ${table} table if it existed.`);
        }

        //TODO: Add your faker-based seeding logic here

        con.release(); 
        console.log('Database connection released.');
        await pool.end();
    } catch (error) {
        console.log('Error connecting to database:', error);
        process.exit(1);
    }
})();
