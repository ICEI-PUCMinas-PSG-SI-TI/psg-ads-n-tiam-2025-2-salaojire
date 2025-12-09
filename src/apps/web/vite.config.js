import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Isso é crucial para Monorepos: Evita que o React seja carregado duas vezes
    dedupe: ['react', 'react-dom'],
    alias: {
      // Seu alias para os pacotes compartilhados
      '@packages': path.resolve(__dirname, '../../packages'), 
    },
  },
  server: {
    fs: {
      // Permite importar arquivos fora da pasta do projeto (caso precise do @packages)
      allow: ['..'],
    },
  },
})