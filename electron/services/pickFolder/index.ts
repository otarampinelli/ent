import { dialog } from 'electron/main'

export async function pickFolder() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (!canceled) {
    return filePaths[0]
  }
}
