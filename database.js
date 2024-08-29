import mysql from 'mysql2/promise';

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',         // Replace with your MySQL username
    password: '',         // Replace with your MySQL password
    database: 'myapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool; // Use export default to export the pool
