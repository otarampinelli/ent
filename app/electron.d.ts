import type { registerInvoke } from '../electron/invoke/index'

declare global {
  interface Window {
    electronAPI: ReturnType<typeof registerInvoke>
  }
}

export {}
