import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { resolveUserDataDir } from './paths.ts'
import { runMigrations } from './migrations.ts'

let db: DatabaseSync | null = null

export function getDbPath() {
  const userDataDir = resolveUserDataDir()
  if (!existsSync(userDataDir)) mkdirSync(userDataDir, { recursive: true })
  return path.join(userDataDir, 'ent.db')
}

export function getDb(): DatabaseSync {
  if (db) return db

  db = new DatabaseSync(getDbPath())
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')
  runMigrations(db)

  return db
}

export function closeDb() {
  db?.close()
  db = null
}
