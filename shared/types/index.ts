export type ProjectId = string

export interface Project {
  id: ProjectId
  name: string
  repoPath: string
  defaultBase: string
  createdAt: number
}

export interface AddProjectInput {
  name: string
  repoPath: string
  defaultBase?: string
}
