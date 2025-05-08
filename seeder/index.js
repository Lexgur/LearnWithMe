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

        sql = 'DROP TABLE IF EXISTS users';
        await con.query(sql);
        console.log('Dropped users table if it existed.');

        // TODO: Add your faker-based seeding logic here

        con.release(); 
        console.log('Database connection released.');
        await pool.end();
    } catch (error) {
        console.log('Error connecting to database:', error);
        process.exit(1);
    }
})();
