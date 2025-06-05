import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import istanbul from "vite-plugin-istanbul";
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "cypress"],
      extension: [".ts", ".tsx"],
      cypress: true,
      requireEnv: false,
    }),
  ],
  build: {
    sourcemap: true, // o 'inline' o 'hidden'
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173
  }
})