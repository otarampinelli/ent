import { ipcMain } from 'electron'
import { pickFolder } from '../services/pickFolder'

export function registerPickFolderHandlers() {
  ipcMain.handle('pickFolder.select', async (_event) => {
    return await pickFolder()
  })
}
