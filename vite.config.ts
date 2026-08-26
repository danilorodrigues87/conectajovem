import os from 'node:os';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function detectLanIPv4(): string | undefined {
  const nets = os.networkInterfaces();
  for (const ifaces of Object.values(nets)) {
    if (!ifaces) continue;
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return undefined;
}

function isPrivateDevHost(hostname: string): boolean {
  if (['localhost', '127.0.0.1', '::1'].includes(hostname)) return true;
  return /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(hostname);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost';
  const base = env.VITE_BASE_PATH || '/';
  const port = Number(env.VITE_DEV_PORT || 5173);

  const lanIpRaw = env.VITE_DEV_LAN_IP?.trim();
  const lanIp =
    lanIpRaw === 'auto' || lanIpRaw === '1'
      ? detectLanIPv4()
      : lanIpRaw || detectLanIPv4();

  return {
    base,
    plugins: [react()],
    server: {
      port,
      host: '0.0.0.0',
      strictPort: true,
      cors: {
        origin(origin, callback) {
          if (!origin) {
            callback(null, true);
            return;
          }
          try {
            callback(null, isPrivateDevHost(new URL(origin).hostname));
          } catch {
            callback(null, false);
          }
        },
      },
      hmr: lanIp
        ? {
            host: lanIp,
            port,
            protocol: 'ws',
          }
        : true,
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
