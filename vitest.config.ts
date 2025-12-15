import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
   resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./components"),
      "@lib": path.resolve(__dirname, "./lib"),
    }
  },
  test: {
    environment: 'node',
    globals: true,
    exclude: ['**/node_modules/**', "**/testing/**"],
  },
})
