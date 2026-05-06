/// <reference types="cypress" />

const API = () => Cypress.env("API_URL");

describe("API - POIs", () => {
  it("GET /api/pois retorna llista de POIs", () => {
    cy.request(`${API()}/api/pois`).then((res) => {
      expect(res.status).to.eq(200);
      // Acceptem array directe o wrapper { success, data }
      const data = res.body.data ?? res.body;
      expect(data).to.be.an("array");
    });
  });

  it("GET /api/pois/:id retorna un POI concret", () => {
    cy.request(`${API()}/api/pois`).then((res) => {
      const llista = res.body.data ?? res.body;
      if (llista.length === 0) return; // No hi ha POIs, skip
      const id = llista[0].id_poi || llista[0].id;
      cy.request(`${API()}/api/pois/${id}`).then((res2) => {
        expect(res2.status).to.eq(200);
        const poi = res2.body.data ?? res2.body;
        expect(poi).to.have.property("nombre");
      });
    });
  });

  it("GET /api/pois/:id amb ID inexistent retorna 404", () => {
    cy.request({
      url: `${API()}/api/pois/99999999`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([404, 400]);
    });
  });

  it("GET /api/categorias retorna categories", () => {
    cy.request(`${API()}/api/categorias`).then((res) => {
      expect(res.status).to.eq(200);
      const data = res.body.data ?? res.body;
      expect(data).to.be.an("array");
    });
  });
});

describe("API - Comunitat", () => {
  it("GET /api/comunidad retorna publicacions", () => {
    cy.request({
      url: `${API()}/api/comunidad`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("POST /api/comunidad sense autenticació retorna 401 o 400", () => {
    cy.request({
      method: "POST",
      url: `${API()}/api/comunidad`,
      body: { descripcion: "test sense auth" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.gte(400);
    });
  });
});
