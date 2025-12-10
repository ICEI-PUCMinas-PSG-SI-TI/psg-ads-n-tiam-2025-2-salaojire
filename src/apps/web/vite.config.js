import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    envPrefix: ['VITE_', 'EXPO_PUBLIC_'], 
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@packages': path.resolve(__dirname, '../../packages'), 
      },
    },

    define: {
      'process.env.EXPO_PUBLIC_API_KEY': JSON.stringify(env.EXPO_PUBLIC_API_KEY),
      'process.env.EXPO_PUBLIC_AUTH_DOMAIN': JSON.stringify(env.EXPO_PUBLIC_AUTH_DOMAIN),
      'process.env.EXPO_PUBLIC_PROJECT_ID': JSON.stringify(env.EXPO_PUBLIC_PROJECT_ID),
      'process.env.EXPO_PUBLIC_STORAGE_BUCKET': JSON.stringify(env.EXPO_PUBLIC_STORAGE_BUCKET),
      'process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID': JSON.stringify(env.EXPO_PUBLIC_MESSAGING_SENDER_ID),
      'process.env.EXPO_PUBLIC_APP_ID': JSON.stringify(env.EXPO_PUBLIC_APP_ID),

      'process.env': {},
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
  }
})