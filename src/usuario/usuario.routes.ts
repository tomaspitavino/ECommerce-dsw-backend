import { Router } from "express";
import { requireRole, verifyToken } from "../auth/auth.middleware.js";
import {
  addFavorito,
  findAllFavoritos,
  removeFavorito,
  sanitizeFavoritoInput,
} from "../favoritos/favoritos.controller.js";
import { findOne as findOneMueble } from "../mueble/mueble.controller.js";
import {
  add,
  findAll,
  findOne,
  remove,
  sanitizeClientInput,
  sanitizeClientPatchInput,
  perfil,
  update,
} from "./usuario.controller.js";

export const usuarioRouter = Router();

// clienteRouter.post('/:id/favoritos/:muebleId', sanitizeFavoritoInput, addFavorito);
// este approach requiere el id literal del mueble en el post de REST

// Favoritos — usuario autenticado
usuarioRouter.get("/:id/favoritos/", verifyToken, findAllFavoritos);
usuarioRouter.get(
  "/:id/favoritos/mueble/:idMueble",
  verifyToken,
  findOneMueble,
);
usuarioRouter.post(
  "/:id/favoritos/",
  verifyToken,
  sanitizeFavoritoInput,
  addFavorito,
);
usuarioRouter.delete("/:id/favoritos/:muebleId", verifyToken, removeFavorito);

// CRUD independiente: /api/clientes
// CRUD — registro público, resto protegido
usuarioRouter.post("/", sanitizeClientInput, add); // público: registro
usuarioRouter.get("/", verifyToken, requireRole("admin"), findAll); // solo admin
usuarioRouter.get("/perfil", verifyToken, perfil);
usuarioRouter.get("/:id", verifyToken, findOne); // autenticado
usuarioRouter.put("/:id", verifyToken, sanitizeClientInput, update); // autenticado
usuarioRouter.patch("/:id", verifyToken, sanitizeClientPatchInput, update); // autenticado
usuarioRouter.delete("/:id", verifyToken, requireRole("admin"), remove);
