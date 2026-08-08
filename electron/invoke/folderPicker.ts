import { ipcRenderer } from 'electron'

export const selectFolder = () => ipcRenderer.invoke('pickFolder.select')
