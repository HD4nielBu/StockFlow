import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/ · https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El CorsConfig del backend sólo permite http://localhost:5173. Si el puerto está ocupado,
    // es mejor que Vite se detenga con un error claro a que use 5174 y todo falle por CORS.
    port: 5173,
    strictPort: true,
  },
  preview: {
    // .env.production usa /api (relativa): en preview se reenvía al backend local, como hace nginx.conf.
    // Sólo para probar dist/ en local: sin Origin, Spring no la trata como CORS (nginx conserva el Host y no lo necesita).
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        configure: (proxy) => proxy.on('proxyReq', (req) => req.removeHeader('origin')),
      },
    },
  },
  test: {
    // G10: jsdom simula el navegador (document, window) para renderizar componentes
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Vitest corre en modo "test" y no lee .env.development: se define aquí la URL de la API
    env: { VITE_API_URL: 'http://localhost:8080/api' },
  },
})
