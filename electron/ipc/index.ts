import { registerProjectHandlers } from './handlers/projects.ts'

export function registerIpcHandler() {
  registerProjectHandlers()
}
