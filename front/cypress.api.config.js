import { defineConfig } from "cypress";

// Config específica per als tests d'API (no requereix el frontend aixecat)
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/api/**/*.cy.{js,jsx}",
    supportFile: "cypress/support/e2e.js",
    video: false,
    screenshotOnRunFailure: false,
    env: {
      API_URL: "http://localhost:3000",
    },
  },
});
