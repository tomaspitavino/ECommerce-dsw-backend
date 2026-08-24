import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import { createApp } from "../createApp.js";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.mysql.js";

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

  it("POST /api/clientes no permite registrarse como admin ni con fondos arbitrarios", async () => {
    const res = await request(app).post("/api/clientes").send({
      nombre: "Test",
      apellido: "User",
      direccion: "Calle 123",
      telefono: "12345678",
      dni: "99887766",
      usuario: "testadmin99",
      email: "testadmin99@test.com",
      contrasenia: "test1234a",
      rol: "admin",
      fondos: 999999,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.rol).toBe("cliente");
    expect(res.body.data.fondos).toBe(0);
  });

  afterAll(async () => {
    const em = orm.em.fork();
    const usuario = await em.findOne(Usuario, {
      email: "testadmin99@test.com",
    });
    if (usuario) {
      await em.removeAndFlush(usuario);
    }
  });
});
