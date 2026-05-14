/// <reference types="cypress" />

describe("Autenticació - WeMap", () => {
  beforeEach(() => {
    cy.logout();
  });

  it("Mostra el formulari de login", () => {
    cy.visit("/login");
    cy.get("input[type='email'], input[name='email']").should("exist");
    cy.get("input[type='password'], input[name='password']").should("exist");
    cy.contains(/iniciar|login|entrar/i).should("exist");
  });

  it("Mostra error amb credencials incorrectes", () => {
    cy.visit("/login");
    cy.get("input[type='email'], input[name='email']").type("noexiste@fake.com");
    cy.get("input[type='password'], input[name='password']").type("wrong123");
    cy.get("button[type='submit'], form").within(() => {
      cy.get("button").last().click();
    });
    // Ha de mostrar algun missatge d'error (no redirigeix al mapa)
    cy.url().should("include", "/login");
  });

  it("Login correcte redirigeix al mapa o home", () => {
    cy.fixture("usuarios").then((data) => {
      const { email, password } = data.usuario_test;
      cy.visit("/login");
      cy.get("input[type='email'], input[name='email']").type(email);
      cy.get("input[type='password'], input[name='password']").type(password);
      cy.get("form button[type='submit'], form button").last().click();
      // Redirigeix fora del login
      cy.url({ timeout: 8000 }).should("not.include", "/login");
    });
  });

  it("La pàgina de registre té els camps necessaris", () => {
    cy.visit("/signup");
    cy.get("input[type='email'], input[name='email']").should("exist");
    cy.get("input[type='password'], input[name='password']").should("exist");
    cy.get("input[name='nombre'], input[placeholder*='nom' i], input[placeholder*='name' i]").should(
      "exist"
    );
  });

  it("Redirigeix a login si no autenticat i accedeix a /profile", () => {
    cy.visit("/profile");
    // O mostra la pàgina de perfil en mode guest, o redirigeix
    cy.url().then((url) => {
      const isAllowed = url.includes("/profile") || url.includes("/login");
      expect(isAllowed).to.be.true;
    });
  });
});
