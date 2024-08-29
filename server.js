const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',         // Replace with your MySQL username
    password: 'nomans10073',         // Replace with your MySQL password
    database: 'myapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify for Node.js async/await
const promisePool = pool.promise();

async function hashPassword(password) {
    try {
        const saltRounds = 10; // Number of salt rounds
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function comparePassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        console.error(err);
        throw err;
    }
}




// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve the user login page
app.get('/user-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user-login.html'));
});

// Serve the user page
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Handle admin login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ? AND role = "admin"', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

// Handle user login
app.post('/user-login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ? AND role = "user"', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

// Handle user creation
app.post('/create-user', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await promisePool.query('INSERT INTO users (username, password, role) VALUES (?, ?, "user")', [username, hashedPassword]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
