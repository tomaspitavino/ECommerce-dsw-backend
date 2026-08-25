import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

vi.mock("express-rate-limit", () => ({
  default: () => (_req: any, _res: any, next: any) => next(),
}));

import { createApp } from "../createApp.js";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { Favorito } from "./favoritos.entity.mysql.js";
import { Categoria } from "../categoria/categoria.entity.mysql.js";
import { Material } from "../material/material.entity.mysql.js";

const em = orm.em.fork();

let contador = 0;
function emailUnico() {
  contador += 1;
  return `test.favoritos.${Date.now()}.${contador}@example.com`;
}

async function crearUsuario(rol: "cliente" | "admin" = "cliente") {
  const usuario = em.create(Usuario, {
    nombre: "Test",
    apellido: "Usuario",
    direccion: "Calle Falsa 123",
    telefono: "12345678",
    dni: `${Date.now()}`.slice(-8) + contador,
    usuario: `test_${Date.now()}_${contador++}`,
    email: emailUnico(),
    passwordHash: "hash-de-prueba-no-usado-en-login",
    rol,
    fondos: 0,
  });
  await em.persistAndFlush(usuario);
  return usuario;
}

async function crearCategoriaYMaterial() {
  const categoria = em.create(Categoria, {
    nombre: `categoria-test-${Date.now()}-${contador++}`,
    descripcion: "Categoría de prueba para integración de favoritos",
  });
  const material = em.create(Material, {
    nroMaterial: `material-test-${Date.now()}-${contador++}`,
    nombre: "Material de prueba",
  });
  await em.persistAndFlush([categoria, material]);
  return { categoria, material };
}

async function crearMueble() {
  const { categoria, material } = await crearCategoriaYMaterial();

  const mueble = em.create(Mueble, {
    descripcion: "Mueble de prueba para integración de favoritos",
    stock: 10,
    etiqueta: "test-mueble-favorito",
    precioUnitario: 1000,
    imagenes: ["https://example.com/img.png"],
    activo: true,
    categoria,
    material,
  } as any);
  await em.persistAndFlush(mueble);
  return mueble;
}

async function crearFavorito(usuario: Usuario, mueble: Mueble) {
  const favorito = em.create(Favorito, {
    usuario,
    mueble,
  } as any);
  await em.persistAndFlush(favorito);
  return favorito;
}

function tokenPara(usuario: { id?: number; rol: string }) {
  if (usuario.id === undefined) {
    throw new Error(
      "No se puede generar un token para un usuario sin id persistido",
    );
  }
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET!,
  );
}

describe("Favoritos integration — autorización horizontal (IDOR/BOLA)", () => {
  const app = createApp();

  // ---------------------------------------------------------------------
  // DELETE /api/clientes/:id/favoritos/:muebleId — removeFavorito
  // ---------------------------------------------------------------------
  describe("DELETE /api/clientes/:id/favoritos/:muebleId", () => {
    it("sin token devuelve 401", async () => {
      const res = await request(app).delete("/api/clientes/1/favoritos/1");
      expect(res.status).toBe(401);
    });

    it("el dueño puede eliminar su propio favorito (200)", async () => {
      const cliente = await crearUsuario("cliente");
      const mueble = await crearMueble();
      await crearFavorito(cliente, mueble);
      const token = tokenPara(cliente);

      const res = await request(app)
        .delete(`/api/clientes/${cliente.id}/favoritos/${mueble.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const favoritoEnBase = await em.findOne(Favorito, {
        usuario: cliente.id,
        mueble: mueble.id,
      });
      expect(favoritoEnBase).toBeNull();
    });

    it(
      "un usuario NO puede eliminar el favorito de otro usuario (403) " +
        "y el favorito ajeno permanece intacto",
      async () => {
        const dueño = await crearUsuario("cliente");
        const intruso = await crearUsuario("cliente");
        const mueble = await crearMueble();
        await crearFavorito(dueño, mueble);
        const tokenIntruso = tokenPara(intruso);

        const res = await request(app)
          .delete(`/api/clientes/${dueño.id}/favoritos/${mueble.id}`)
          .set("Authorization", `Bearer ${tokenIntruso}`);

        expect(res.status).toBe(403);

        // El favorito del dueño real no debe haberse tocado.
        const favoritoEnBase = await em.findOne(Favorito, {
          usuario: dueño.id,
          mueble: mueble.id,
        });
        expect(favoritoEnBase).not.toBeNull();
      },
    );

    it(
      "un usuario NO puede eliminar el favorito de otro aunque el " +
        "mueble no exista entre sus propios favoritos (no hay fuga de " +
        "información vía 404 vs 403)",
      async () => {
        const dueño = await crearUsuario("cliente");
        const intruso = await crearUsuario("cliente");
        const mueble = await crearMueble();
        await crearFavorito(dueño, mueble);
        const tokenIntruso = tokenPara(intruso);

        const res = await request(app)
          .delete(`/api/clientes/${dueño.id}/favoritos/${mueble.id}`)
          .set("Authorization", `Bearer ${tokenIntruso}`);

        expect(res.status).toBe(403);
      },
    );

    it("un admin puede eliminar el favorito de cualquier usuario (200)", async () => {
      const cliente = await crearUsuario("cliente");
      const admin = await crearUsuario("admin");
      const mueble = await crearMueble();
      await crearFavorito(cliente, mueble);
      const tokenAdmin = tokenPara(admin);

      const res = await request(app)
        .delete(`/api/clientes/${cliente.id}/favoritos/${mueble.id}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);

      expect(res.status).toBe(200);

      const favoritoEnBase = await em.findOne(Favorito, {
        usuario: cliente.id,
        mueble: mueble.id,
      });
      expect(favoritoEnBase).toBeNull();
    });

    it(
      "regresión del bug original: cliente autenticado no puede borrar " +
        "favoritos ajenos solo por conocer/enumerar el :id en la URL",
      async () => {
        const victima = await crearUsuario("cliente");
        const atacante = await crearUsuario("cliente");
        const muebleFavoritoVictima = await crearMueble();
        await crearFavorito(victima, muebleFavoritoVictima);
        const tokenAtacante = tokenPara(atacante);

        const res = await request(app)
          .delete(
            `/api/clientes/${victima.id}/favoritos/${muebleFavoritoVictima.id}`,
          )
          .set("Authorization", `Bearer ${tokenAtacante}`);

        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/Acceso denegado/);

        const favoritoEnBase = await em.findOne(Favorito, {
          usuario: victima.id,
          mueble: muebleFavoritoVictima.id,
        });
        expect(favoritoEnBase).not.toBeNull();
      },
    );
  });
});