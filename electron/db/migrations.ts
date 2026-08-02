import type { DatabaseSync } from 'node:sqlite'

export interface Migration {
  version: number
  sql: string
}

export const migrations: Migration[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);

      CREATE TABLE projects (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        repo_path     TEXT NOT NULL UNIQUE,
        default_base  TEXT NOT NULL DEFAULT 'main',
        created_at    INTEGER NOT NULL
      );

      CREATE TABLE workspaces (
        id            TEXT PRIMARY KEY,
        project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name          TEXT NOT NULL,
        branch        TEXT NOT NULL,
        worktree_path TEXT NOT NULL UNIQUE,
        base_branch   TEXT,
        created_at    INTEGER NOT NULL
      );

      CREATE TABLE terminals (
        id            TEXT PRIMARY KEY,
        workspace_id  TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        pane_id       TEXT NOT NULL,
        cwd           TEXT NOT NULL,
        shell         TEXT
      );

      CREATE TABLE pane_layouts (
        workspace_id  TEXT PRIMARY KEY REFERENCES workspaces(id) ON DELETE CASCADE,
        layout_json   TEXT NOT NULL
      );

      CREATE TABLE sessions (
        id            TEXT PRIMARY KEY,
        workspace_id  TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        agent_command TEXT NOT NULL,
        resume_token  TEXT,
        last_active_at INTEGER
      );

      CREATE TABLE chat_messages (
        id            TEXT PRIMARY KEY,
        workspace_id  TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        role          TEXT NOT NULL,
        content       TEXT NOT NULL,
        created_at    INTEGER NOT NULL
      );

      CREATE TABLE checks (
        id            TEXT PRIMARY KEY,
        project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name          TEXT NOT NULL,
        source_path   TEXT NOT NULL,
        enabled       INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE check_runs (
        id            TEXT PRIMARY KEY,
        workspace_id  TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        check_id      TEXT NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
        status        TEXT NOT NULL,
        output        TEXT,
        run_at        INTEGER NOT NULL
      );
    `
  }
]

export function runMigrations(database: DatabaseSync, pending: Migration[] = migrations) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER NOT NULL
    );
  `)

  const { version } = database
    .prepare('SELECT COALESCE(MAX(version), 0) AS version FROM schema_version')
    .get() as { version: number }

  for (const migration of pending) {
    if (migration.version <= version) continue

    database.exec('BEGIN')
    try {
      database.exec(migration.sql)
      database.exec(`INSERT INTO schema_version (version) VALUES (${migration.version})`)
      database.exec('COMMIT')
    } catch (err) {
      database.exec('ROLLBACK')
      throw err
    }
  }
}
