import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (development/production)
  // O terceiro argumento '' permite carregar todas as variáveis, não só as que começam com VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@packages': path.resolve(__dirname, '../../packages'), 
      },
    },
    //  corrige erro "process is not defined"
    define: {
      'process.env': env
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
  }
})