import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getAppName(): string {
  const pkg = require(path.join(__dirname, '../../package.json'))
  return pkg.name
}

export function resolveUserDataDir(): string {
  if (process.versions.electron) {
    const { app } = require('electron')
    return app.getPath('userData')
  }

  const appName = getAppName()
  const home = os.homedir()

  switch (process.platform) {
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', appName)
    case 'win32':
      return path.join(process.env.APPDATA ?? path.join(home, 'AppData', 'Roaming'), appName)
    default:
      return path.join(process.env.XDG_CONFIG_HOME ?? path.join(home, '.config'), appName)
  }
}
