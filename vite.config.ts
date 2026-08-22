import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api/v1': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, '/pjt/painel-cti/api/v1'),
        },
        '/uploads': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => `/pjt/painel-cti${path}`,
        },
      },
    },
  };
});
