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

});

module.exports = db;
