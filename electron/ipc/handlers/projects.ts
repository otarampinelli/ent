import {ipcMain} from 'electron'
import { insertProject } from '../../db/projects.ts'
import type { AddProjectInput } from '../../../shared/types/index.ts'

export function registerProjectHandlers() {
  ipcMain.handle('project.add', (_event, input: AddProjectInput) => insertProject(input))
}
