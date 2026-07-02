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
});
