import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separate build that bundles the app for Node so prerender.mjs can import it.
// Output is forced to .mjs because the project has no "type": "module", and the
// SSR bundle is ESM — a plain .js would be parsed as CommonJS and fail to load.
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist-server',
    emptyOutDir: true,
    rollupOptions: {
      output: { entryFileNames: 'entry-server.mjs' },
    },
  },
})
