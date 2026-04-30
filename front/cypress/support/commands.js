// Crea automàticament els usuaris de test via endpoint de seeding (dev only)
Cypress.Commands.add("setupTestUsers", () => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("API_URL")}/api/test/seed`,
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(`Seed failed: ${res.body?.message || res.status}`);
    }
  });
});

Cypress.Commands.add("loginViaAPI", (email, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("API_URL")}/api/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status === 200 && res.body.token) {
      // Guardem les dades a Cypress.env per usar-les a onBeforeLoad
      Cypress.env("_token", res.body.token);
      Cypress.env("_usuario", JSON.stringify(res.body.usuario));
    }
  });
});

// Visita una ruta amb la sessió activa (cal cridar loginViaAPI primer)
Cypress.Commands.add("visitAutenticat", (path = "/") => {
  const token = Cypress.env("_token");
  const usuario = Cypress.env("_usuario");
  cy.visit(path, {
    onBeforeLoad(win) {
      if (token) win.localStorage.setItem("token", token);
      if (usuario) win.localStorage.setItem("usuario", usuario);
    },
  });
});

// Comando: registrar usuario de test si no existe
Cypress.Commands.add("registrarSiNoExiste", (nombre, email, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("API_URL")}/api/auth/register`,
    body: { nombre, email, password },
    failOnStatusCode: false,
  });
});

// Comando: limpiar sesión
Cypress.Commands.add("logout", () => {
  cy.clearLocalStorage();
});
