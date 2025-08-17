import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Use loadEnv so we can read VITE_* in this Node context cleanly
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // loads .env, .env.[mode]

  // Small helper to ensure required vars are present in CI/CD
  const required = ["VITE_API_BASE_URL", "VITE_GOOGLE_CLIENT_ID"] as const;
  for (const key of required) {
    if (!env[key]) {
      // eslint-disable-next-line no-console
      console.warn(`[vite] Missing ${key} in .env.${mode} (or .env).`);
    }
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
      strictPort: true, // fail fast if 3000 is taken
      open: true,
      proxy: {
        // Keep frontend code using fetch('/api/...') in dev
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:5006",
          changeOrigin: true,
          // If  backend uses cookies/session, keep credentials:
          // configure your fetch with credentials: 'include' as well.
        },
      },
    },
    build: {
      sourcemap: true,
      outDir: "dist",
      assetsDir: "assets",
      // Can add rollupOptions here if multiple entry points needed.
    },
    // Useful constants wanted in the app at build time (optional)
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});
