import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Tutte le richieste dal frontend che iniziano con /api...
      '/api': {
        // ...verranno reindirizzate al tuo server backend
        target: 'http://localhost:3001',
        // Questa opzione è importante per evitare problemi con CORS
        changeOrigin: true,
      }
    }
  }
})
