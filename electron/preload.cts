import { contextBridge } from 'electron'
import { registerInvoke } from './invoke/index'

contextBridge.exposeInMainWorld('electronAPI', {
  ...registerInvoke(),
})
