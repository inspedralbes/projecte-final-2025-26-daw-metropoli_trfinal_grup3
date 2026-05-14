/// <reference types="cypress" />

describe("Comunitat - WeMap", () => {
  beforeEach(() => {
    cy.fixture("usuarios").then((data) => {
      cy.loginViaAPI(data.usuario_test.email, data.usuario_test.password);
    });
  });

  it("La pàgina de comunitat carrega correctament", () => {
    cy.visitAutenticat("/community");
    cy.url().should("include", "/community");
    cy.get("body").should("not.be.empty");
  });

  it("Mostra publicacions o missatge buit", () => {
    cy.visit("/community");
    // O mostra posts o missatge de "No hi ha publicacions"
    cy.get("body", { timeout: 10000 }).should(($body) => {
      const hasPost =
        $body.text().match(/publicaci|post|explore/i) ||
        $body.find("img").length > 0 ||
        $body.find("article, [data-testid='post']").length > 0;
      expect(hasPost).to.be.ok;
    });
  });

  it("Existeix un botó o acció per crear una publicació", () => {
    cy.visit("/community");
    cy.get("button, a").then(($btns) => {
      const hasCreateBtn = [...$btns].some((btn) =>
        /nova|nuevo|crear|add|publica|\+/i.test(btn.textContent)
      );
      expect(hasCreateBtn).to.be.true;
    });
  });
});
