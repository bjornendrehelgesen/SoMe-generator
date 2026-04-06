import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "app.db");

fs.mkdirSync(dataDir, { recursive: true });

const database = new Database(dbPath);
database.pragma("journal_mode = WAL");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'admin')),
    status TEXT NOT NULL CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS prompt_templates (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt_body TEXT NOT NULL,
    visibility TEXT NOT NULL CHECK(visibility IN ('private', 'public')),
    status TEXT NOT NULL CHECK(status IN ('active', 'hidden')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS rewrite_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    input_text TEXT NOT NULL,
    full_prompt TEXT NOT NULL,
    generated_result TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export function getDb() {
  return database;
}
