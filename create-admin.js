import bcrypt from 'bcrypt';
import pool from './database.js'; // Import pool using ES Modules

const promisePool = pool; // No need to call `pool.promise()` since mysql2/promise already provides a promise-based API

async function createAdmin(username, password, firstName, lastName, email, profileImage) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await promisePool.query(
            'INSERT INTO users (username, first_name, last_name, email, password, profile_image, role) VALUES (?, ?, ?, ?, ?, ?, "admin")',
            [username, firstName, lastName, email, hashedPassword, profileImage]
        );
        console.log('Admin user created successfully!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        pool.end(); // Close the database connection
    }
}

// Replace the following values with your desired admin user details
createAdmin('secondadmin1', 'admin', 'user', 'secondadmin1', 'secondadmin1@gmail.com', null);
