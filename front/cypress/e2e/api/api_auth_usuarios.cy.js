/// <reference types="cypress" />

const API = () => Cypress.env("API_URL");

describe("API - Autenticació", () => {
  it("POST /api/auth/login amb credencials vàlides retorna token", () => {
    cy.fixture("usuarios").then((data) => {
      cy.request({
        method: "POST",
        url: `${API()}/api/auth/login`,
        body: {
          email: data.usuario_test.email,
          password: data.usuario_test.password,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.be.oneOf([200, 201]);
        expect(res.body.data).to.have.property("token");
        expect(res.body.data).to.have.property("usuario");
      });
    });
  });

  it("POST /api/auth/login amb credencials incorrectes retorna 401 o 400", () => {
    cy.request({
      method: "POST",
      url: `${API()}/api/auth/login`,
      body: { email: "noexiste@fake.com", password: "wrongpassword" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 401, 404]);
    });
  });

  it("POST /api/auth/login sense body retorna error", () => {
    cy.request({
      method: "POST",
      url: `${API()}/api/auth/login`,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.gte(400);
    });
  });
});

describe("API - Usuaris", () => {
  let token;

  before(() => {
    cy.fixture("usuarios").then((data) => {
      cy.request({
        method: "POST",
        url: `${API()}/api/auth/login`,
        body: { email: data.usuario_test.email, password: data.usuario_test.password },
        failOnStatusCode: false,
      }).then((res) => {
        if (res.status === 200) token = res.body.data?.token || res.body.token;
      });
    });
  });

  it("GET /api/usuarios retorna llista d'usuaris", () => {
    cy.request(`${API()}/api/usuarios`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("success", true);
      expect(res.body.data).to.be.an("array");
    });
  });

  it("GET /api/usuarios/:id retorna un usuari concret", () => {
    cy.request(`${API()}/api/usuarios`).then((res) => {
      const primerUsuari = res.body.data[0];
      const id = primerUsuari.id_usuario || primerUsuari.id;
      cy.request(`${API()}/api/usuarios/${id}`).then((res2) => {
        expect(res2.status).to.eq(200);
        expect(res2.body.data).to.have.property("nombre");
      });
    });
  });

  it("GET /api/usuarios/:id amb ID inexistent retorna 404", () => {
    cy.request({
      url: `${API()}/api/usuarios/99999999`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(404);
    });
  });
});
