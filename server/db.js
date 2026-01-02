import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

let db = null;
let initError = null;

try {
  console.log('[DB] Starting database initialization...');

  // Use environment variable DB_PATH if provided
  const dbDir = process.env.DB_PATH || join(process.cwd(), 'data');

  console.log(dbDir);
  
  if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

  const dbPath = join(dbDir, 'shop.db');
  console.log('[DB] Using DB_PATH:', dbPath);

  db = new Database(dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `).run();

  console.log('[DB] Database initialized successfully');
} catch (error) {
  console.error('[DB] Database initialization error:', error);
  initError = error?.message || 'Unknown error';
  db = null;
}

export default db;
export { initError };
