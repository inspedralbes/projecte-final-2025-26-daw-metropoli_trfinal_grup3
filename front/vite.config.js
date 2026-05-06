import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true, // necesario en Windows + Docker
      interval: 500, // comprueba cambios cada 500ms
    },
    hmr: {
      clientPort: 5173,
    },
  },
});
