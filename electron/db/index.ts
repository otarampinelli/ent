import { DatabaseSync } from 'node:sqlite'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { app } = require('electron')

let db: DatabaseSync | null = null

function getDbPath() {
  const userDataDir = app.getPath('userData')
  if (!existsSync(userDataDir)) mkdirSync(userDataDir, { recursive: true })
  return path.join(userDataDir, 'ent.db')
}

function migrate(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    );
  `)

  const { version } = database.prepare('SELECT COALESCE(MAX(version), 0) AS version FROM schema_version').get() as { version: number }

  if (version < 1) {
    database.exec('INSERT INTO schema_version (version) VALUES (1)')
  }
}

export function getDb(): DatabaseSync {
  if (db) return db

  db = new DatabaseSync(getDbPath())
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  migrate(db)

  return db
}

export function closeDb() {
  db?.close()
  db = null
}
