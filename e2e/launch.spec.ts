import path from 'node:path'
import { test, expect, _electron as electron } from '@playwright/test'

test('launches the app window', async () => {
  // Strip ELECTRON_RUN_AS_NODE: if set in the host env, Electron launches as a
  // plain Node process instead of a real app (no `app`/BrowserWindow API).
  const { ELECTRON_RUN_AS_NODE: _ignored, ...env } = process.env

  const app = await electron.launch({
    args: [path.join(import.meta.dirname, '../dist-electron/main.js')],
    env,
  })

  const window = await app.firstWindow()
  await expect(window).toHaveTitle('Ent')

  await app.close()
})
