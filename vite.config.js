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
      outDir: '../invoiceninja/public/react',  // <— output directly to sister repo
      assetsDir: 'assets',       // <— put chunks in /assets/ instead of /react/
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // Group application code into fewer chunks
            if (id.includes('/src/pages/')) {
              return 'pages';
            }
            if (id.includes('/src/components/')) {
              return 'components';
            }
            if (id.includes('/src/hooks/') || id.includes('/src/utils/')) {
              return 'utils';
            }
          },
        },
      },
    },
  }
});
