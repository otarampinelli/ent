// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['nuxt-electron', '@nuxt/eslint', '@nuxt/ui'],
  ssr: false,
  app: {
    head: {
      title: 'Ent'
    }
  },
  css: ['~/assets/css/main.css'],
  electron: {
    disableDefaultOptions: true,
    build: [
      {
        entry: 'electron/main.ts'
      },
      {
        // electron/preload.cts is CommonJS (see electron/tsconfig.preload.json):
        // sandboxed preload scripts can't be loaded as ESM, so we force a .cjs
        // output here regardless of the project's "type": "module".
        vite: {
          build: {
            rolldownOptions: {
              input: 'electron/preload.cts',
              output: {
                format: 'cjs',
                entryFileNames: 'preload.cjs'
              }
            }
          }
        }
      }
    ]
  }
})