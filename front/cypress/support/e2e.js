import "./commands";

// Crear usuaris de test automàticament abans de qualsevol spec
before(() => {
  cy.setupTestUsers();
});

// Ignorar errores de ResizeObserver (comunes en React + Leaflet)
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("ResizeObserver") || err.message.includes("socket")) {
    return false;
  }
});
