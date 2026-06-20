import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../createApp.js";

describe("Auth integration", () => {
  const app = createApp();

  it("POST /api/auth/login con email inválido devuelve 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "no-es-email", contrasenia: "abc1234a" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Entrada inválida");
  });

  it("GET /api/clientes sin token devuelve 401", async () => {
    const res = await request(app).get("/api/clientes");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Acceso denegado/);
  });

  it("GET /api/clientes con token de cliente devuelve 403", async () => {
    const token = jwt.sign({ id: 1, rol: "cliente" }, process.env.JWT_SECRET!);

    const res = await request(app)
      .get("/api/clientes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Mala autorización/);
  });

  it("POST /api/muebles sin token devuelve 401", async () => {
    const res = await request(app).post("/api/muebles").send({});

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Acceso denegado/);
  });
});
