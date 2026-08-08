import { getDb } from './index.ts'
import type { AddProjectInput, Project } from '../../shared/types/index.ts'

export function insertProject(input: AddProjectInput): Project {
  const db = getDb()

  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name,
    repoPath: input.repoPath,
    defaultBase: input.defaultBase ?? 'main',
    createdAt: Date.now(),
  }

  db.prepare(
    `INSERT INTO projects (id, name, repo_path, default_base, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(project.id, project.name, project.repoPath, project.defaultBase, project.createdAt)

  return project
}
