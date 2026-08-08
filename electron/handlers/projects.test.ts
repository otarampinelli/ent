import { DatabaseSync } from 'node:sqlite'
import type { IpcMainInvokeEvent } from 'electron'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { runMigrations } from '../db/migrations.ts'
import { registerProjectHandlers } from './projects.ts'

type Handler = (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown

const handlers = new Map<string, Handler>()
let db!: DatabaseSync

vi.mock('../../db/index.ts', () => ({
  getDb: () => db,
}))

vi.mock('electron', () => ({
  ipcMain: {
    handle: (channel: string, listener: Handler) => {
      handlers.set(channel, listener)
    },
  },
}))

beforeAll(() => {
  db = new DatabaseSync(':memory:')
  runMigrations(db)
  registerProjectHandlers()
})

describe('project.add', () => {
  it('inserts a row into the projects table', async () => {
    const listener = handlers.get('project.add')
    if (!listener) throw new Error('project.add handler was not registered')

    const project = (await listener({} as IpcMainInvokeEvent, {
      name: 'Ent',
      repoPath: '/repos/ent',
    })) as { id: string }

    expect(project).toMatchObject({
      name: 'Ent',
      repoPath: '/repos/ent',
      defaultBase: 'main',
    })

    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(project.id)
    expect(row).toMatchObject({
      id: project.id,
      name: 'Ent',
      repo_path: '/repos/ent',
      default_base: 'main',
    })
  })
})
