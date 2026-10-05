import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/ · https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // G10: jsdom simula el navegador (document, window) para renderizar componentes
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Vitest corre en modo "test" y no lee .env.development: se define aquí la URL de la API
    env: { VITE_API_URL: 'http://localhost:8080/api' },
  },
})
