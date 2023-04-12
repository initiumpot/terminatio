import { resolve } from 'path'
import { defineConfig } from 'vite'
import progress from 'vite-plugin-progress'
import tsconfigPaths from 'vite-tsconfig-paths'

const commonOutput = {
  preserveModules: true,
  entryFileNames: '[name].[format].js',
  sourcemap: 'inline'
} as const

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      preserveEntrySignatures: 'allow-extension',
      input: 'src/index.ts',
      output: [
        {
          ...commonOutput,
          dir: resolve(__dirname, 'dist/cjs'),
          format: 'cjs'
        },
        {
          ...commonOutput,
          dir: resolve(__dirname, 'dist/esm'),
          format: 'esm'
        }
      ]
    }
  },
  plugins: [
    tsconfigPaths(),
    progress()
  ]
})
