import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from './app.vue'

describe('App', () => {
  it('mounts without errors', async () => {
    const component = await mountSuspended(App)
    expect(component.html()).toBeTruthy()
  })
})
