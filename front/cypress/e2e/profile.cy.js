/// <reference types="cypress" />

describe("Perfil d'usuari - WeMap", () => {
  beforeEach(() => {
    cy.fixture("usuarios").then((data) => {
      cy.loginViaAPI(data.usuario_test.email, data.usuario_test.password);
    });
  });

  it("Carrega la pàgina de perfil propi", () => {
    cy.visitAutenticat("/profile");
    // Ha d'aparèixer algun element del perfil
    cy.get("body").should("not.be.empty");
    // No ha de redirigir al login
    cy.url().should("not.include", "/login");
  });

  it("Mostra les estadístiques del perfil (posts, seguidors, seguint)", () => {
    cy.visitAutenticat("/profile");
    cy.contains(/posts|publicacion/i, { timeout: 8000 }).should("exist");
    cy.contains(/seguidors|seguidores/i).should("exist");
    cy.contains(/seguint|siguiendo/i).should("exist");
  });

  it("El botó d'editar perfil és visible al perfil propi", () => {
    cy.visitAutenticat("/profile");
    cy.contains(/editar|edit/i, { timeout: 8000 }).should("exist");
  });

  it("Visitar el perfil d'un altre usuari mostra el botó Seguir", () => {
    // Obtenim la llista d'usuaris via API
    cy.request(`${Cypress.env("API_URL")}/api/usuarios`).then((res) => {
      expect(res.status).to.eq(200);
      const usuaris = res.body.data || res.body;
      const usuariActual = JSON.parse(Cypress.env("_usuario") || "{}");
      const altre = usuaris.find(
        (u) =>
          (u.id_usuario || u.id) !==
          (usuariActual.id_usuario || usuariActual.id),
      );
      if (altre) {
        cy.visitAutenticat(`/profile/${altre.id_usuario || altre.id}`);
        cy.contains(/seguir|follow/i, { timeout: 8000 }).should("exist");
        // No ha d'aparèixer "Editar"
        cy.contains(/editar perfil/i).should("not.exist");
      }
    });
  });

  it("Acció de seguir/deixar de seguir funciona", () => {
    cy.request(`${Cypress.env("API_URL")}/api/usuarios`).then((res) => {
      const usuaris = res.body.data || res.body;
      const usuariActual = JSON.parse(Cypress.env("_usuario") || "{}");
      const altre = usuaris.find(
        (u) =>
          (u.id_usuario || u.id) !==
          (usuariActual.id_usuario || usuariActual.id),
      );
      if (altre) {
        cy.visitAutenticat(`/profile/${altre.id_usuario || altre.id}`);
        cy.contains(/seguir|follow/i, { timeout: 8000 })
          .first()
          .click();
        // Després del click canvia l'estat
        cy.contains(/seguint|siguiendo|seguir/i, { timeout: 5000 }).should(
          "exist",
        );
      }
    });
  });
});
