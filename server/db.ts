import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from '@shared/schema';
import { resolve } from 'path';

const databasePath = process.env.DATABASE_URL ?? './sqlite.db';
const sqlite = new Database(databasePath);
export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: resolve(import.meta.dirname, '../migrations') });
