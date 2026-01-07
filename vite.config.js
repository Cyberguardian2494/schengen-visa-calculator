import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/schengen-visa-calculator/'
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Schengen Calculator',
        short_name: 'SchengenCalc',
        description: 'Track your 90/180 day Schengen visa limit offline.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192-v2.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'icon-512-v2.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
})