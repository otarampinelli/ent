import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { resolveUserDataDir } from './paths.ts'
import { runMigrations } from './migrations.ts'

function getDbPath(): string {
  const userDataDir = resolveUserDataDir()
  if (!existsSync(userDataDir)) mkdirSync(userDataDir, { recursive: true })
  return path.join(userDataDir, 'ent.db')
}

function migrate() {
  const dbPath = getDbPath()
  const db = new DatabaseSync(dbPath)
  db.exec('PRAGMA foreign_keys = ON')
  runMigrations(db)
  db.close()
  console.log(`Migrated ${dbPath}`)
}

function drop() {
  const dbPath = getDbPath()
  for (const suffix of ['', '-wal', '-shm']) {
    const file = dbPath + suffix
    if (existsSync(file)) rmSync(file)
  }
  console.log(`Dropped ${dbPath}`)
}

const command = process.argv[2]

switch (command) {
  case 'migrate':
    migrate()
    break
  case 'drop':
    drop()
    break
  default:
    console.error('Usage: db-cli <migrate|drop>')
    process.exit(1)
}
