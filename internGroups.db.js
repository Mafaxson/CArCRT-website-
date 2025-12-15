
// SQLite setup for intern groups (ESM)
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./internGroups.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS intern_groups (
    id TEXT PRIMARY KEY,
    name TEXT,
    community TEXT,
    bio TEXT,
    photo TEXT
  )`);
});

export default db;
