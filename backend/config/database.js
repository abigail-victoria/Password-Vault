<<<<<<< HEAD
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

/* =========================
   DATABASE DIRECTORY
========================= */

const dbDir = path.join(__dirname, "../database");

// Create database folder if missing
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

/* =========================
   DATABASE FILE
========================= */

const dbPath = path.join(dbDir, "password_manager.db");

console.log("Database Path:", dbPath);

/* =========================
   DATABASE CONNECTION
========================= */

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database Error:", err.message);
    } else {
        console.log("SQLite Connected");

        // Enable foreign keys
        db.run("PRAGMA foreign_keys = ON;");
    }
});

/* =========================
   CREATE TABLES
========================= */

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error("Users Table Error:", err.message);
        } else {
            console.log("Users table ready");
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            app_name TEXT NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error("Passwords Table Error:", err.message);
        } else {
            console.log("Passwords table ready");
        }
    });
=======
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(async () => {

        console.log("PostgreSQL Connected");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
>>>>>>> 9ddcbb0 (Update)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS passwords (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                app_name VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

<<<<<<< HEAD
module.exports = db;
=======
        console.log("Tables Ready");

    })
    .catch(err => {
        console.error("Database Error:", err.message);
    });

module.exports = pool;
>>>>>>> 9ddcbb0 (Update)
