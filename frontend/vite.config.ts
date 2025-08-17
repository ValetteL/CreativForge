// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Proxy to your ASP.NET backend so fetch('/api/...') keeps working
    proxy: {
      "/api": {
        target: "http://localhost:5000", // ← adapte à ton backend
        changeOrigin: true
      }
    }
  },
  // Optional: aliases for clean imports like "@/components/..."
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  build: {
    sourcemap: true
  }
});