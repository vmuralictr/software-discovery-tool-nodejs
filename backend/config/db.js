require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './database.sqlite');
const db = new Database(dbPath);

module.exports = db;
