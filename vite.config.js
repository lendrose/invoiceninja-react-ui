import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'

  return {
    plugins: [tsconfigPaths(), react()],
    server: {
      port: 3000,
    },
    base: isDev ? '/' : '/react/', // Different base for dev vs build
    build: {
      outDir: 'dist',            // <— keep it clean
      assetsDir: 'assets',       // <— put chunks in /assets/ instead of /react/
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
        },
      },
    },
  }
});
