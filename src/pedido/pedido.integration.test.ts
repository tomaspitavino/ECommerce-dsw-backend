import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../createApp.js";

describe("Pedidos integration", () => {
  const app = createApp();

  it("GET /api/pedidos/admin sin token devuelve 401", async () => {
    const res = await request(app).get("/api/pedidos/admin");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Acceso denegado/);
  });

  it("GET /api/pedidos/admin con token de cliente devuelve 403", async () => {
    const token = jwt.sign({ id: 1, rol: "cliente" }, process.env.JWT_SECRET!);
    const res = await request(app)
      .get("/api/pedidos/admin")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Mala autorización/);
  });

  it("GET /api/pedidos/:clienteId sin token devuelve 401", async () => {
    const res = await request(app).get("/api/pedidos/1");
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Acceso denegado/);
  });

  it("PATCH /api/pedidos/:pedidoId/estado con estado 'pagado' devuelve 400", async () => {
    const token = jwt.sign({ id: 1, rol: "admin" }, process.env.JWT_SECRET!);
    const res = await request(app)
      .patch("/api/pedidos/1/estado")
      .set("Authorization", `Bearer ${token}`)
      .send({ estado: "pagado" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/flujo de confirmación de pagos/);
  });

  it("PATCH /api/pedidos/:pedidoId/estado con transición inválida devuelve 400", async () => {
    const token = jwt.sign({ id: 1, rol: "admin" }, process.env.JWT_SECRET!);
    const res = await request(app)
      .patch("/api/pedidos/1/estado")
      .set("Authorization", `Bearer ${token}`)
      .send({ estado: "entregado" }); // pendiente → entregado es inválido
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Transición de estado inválida/);
  });

  it("PATCH /api/pedidos/:pedidoId/estado sin token devuelve 401", async () => {
    const res = await request(app)
      .patch("/api/pedidos/1/estado")
      .send({ estado: "confirmado" });
    expect(res.status).toBe(401);
  });
});
