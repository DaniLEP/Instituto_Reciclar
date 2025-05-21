import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';


export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // Abre automaticamente o gráfico ao buildar
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // aumenta o limite para evitar alertas
    rollupOptions: {
      output: {
        manualChunks: {
          // separa os grandes pacotes externos
          react: ["react", "react-dom", "react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/database"],
          xlsx: ["xlsx"],
        },
      },
    },
  },
});
