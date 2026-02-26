import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    watch: {
      usePolling: true, // necesario en Windows + Docker
      interval: 500, // comprueba cambios cada 500ms
    },
  },
});
