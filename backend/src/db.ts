import Database from 'better-sqlite3'
import { join } from 'path'
import { mkdirSync } from 'fs'

const dataDir = join(process.cwd(), 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new Database(join(dataDir, 'app.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'to_do',
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id          TEXT PRIMARY KEY,
    task_id     TEXT NOT NULL,
    task_title  TEXT NOT NULL,
    actor       TEXT NOT NULL,
    from_status TEXT,
    to_status   TEXT NOT NULL,
    timestamp   TEXT NOT NULL
  );
`)
