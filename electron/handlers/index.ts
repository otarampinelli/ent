import { registerProjectHandlers } from '../handlers/projects.ts'
import { registerPickFolderHandlers } from './folderPick.ts'

export function registerIpcHandler() {
  registerProjectHandlers()
  registerPickFolderHandlers()
}
