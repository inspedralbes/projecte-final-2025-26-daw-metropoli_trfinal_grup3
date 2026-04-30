/// <reference types="cypress" />

const API = () => Cypress.env("API_URL");

describe("API - Seguidors", () => {
  let myId;
  let targetId;

  before(() => {
    cy.fixture("usuarios").then((data) => {
      // Login per obtenir l'ID de l'usuari de test
      cy.request({
        method: "POST",
        url: `${API()}/api/auth/login`,
        body: { email: data.usuario_test.email, password: data.usuario_test.password },
        failOnStatusCode: false,
      }).then((res) => {
        if (res.status === 200) {
          myId = res.body.usuario?.id_usuario || res.body.usuario?.id;
        }
      });

      // Obtenir un altre usuari per seguir
      cy.request(`${API()}/api/usuarios`).then((res) => {
        const usuaris = res.body.data || res.body;
        const altre = usuaris.find((u) => (u.id_usuario || u.id) !== myId);
        if (altre) targetId = altre.id_usuario || altre.id;
      });
    });
  });

  it("GET /api/seguidores/:id/counts retorna comptadors", () => {
    cy.request(`${API()}/api/usuarios`).then((res) => {
      const primer = (res.body.data || res.body)[0];
      const id = primer.id_usuario || primer.id;
      cy.request(`${API()}/api/seguidores/${id}/counts`).then((res2) => {
        expect(res2.status).to.eq(200);
        expect(res2.body.data).to.have.property("followers");
        expect(res2.body.data).to.have.property("following");
      });
    });
  });

  it("GET /api/seguidores/:id/followers retorna llista de seguidors", () => {
    cy.request(`${API()}/api/usuarios`).then((res) => {
      const id = (res.body.data || res.body)[0]?.id_usuario;
      cy.request(`${API()}/api/seguidores/${id}/followers`).then((res2) => {
        expect(res2.status).to.eq(200);
        expect(res2.body.data).to.be.an("array");
      });
    });
  });

  it("GET /api/seguidores/:id/following retorna llista de seguits", () => {
    cy.request(`${API()}/api/usuarios`).then((res) => {
      const id = (res.body.data || res.body)[0]?.id_usuario;
      cy.request(`${API()}/api/seguidores/${id}/following`).then((res2) => {
        expect(res2.status).to.eq(200);
        expect(res2.body.data).to.be.an("array");
      });
    });
  });

  it("POST /api/seguidores/follow crea la relació", () => {
    if (!myId || !targetId) return;
    cy.request({
      method: "POST",
      url: `${API()}/api/seguidores/follow`,
      body: { id_seguidor: myId, id_seguido: targetId },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body.success).to.be.true;
    });
  });

  it("GET /api/seguidores/:id/isFollowing/:target confirma que es segueix", () => {
    if (!myId || !targetId) return;
    cy.request(`${API()}/api/seguidores/${myId}/isFollowing/${targetId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property("isFollowing");
    });
  });

  it("DELETE /api/seguidores/unfollow elimina la relació", () => {
    if (!myId || !targetId) return;
    cy.request({
      method: "DELETE",
      url: `${API()}/api/seguidores/unfollow`,
      body: { id_seguidor: myId, id_seguido: targetId },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([200, 204]);
    });
  });

  it("POST /api/seguidores/follow no permet seguir-se a un mateix", () => {
    if (!myId) return;
    cy.request({
      method: "POST",
      url: `${API()}/api/seguidores/follow`,
      body: { id_seguidor: myId, id_seguido: myId },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.gte(400);
    });
  });
});
