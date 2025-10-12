import express from "express";
import {
  add,
  findByCliente,
  remove,
  sanitizeFavoritoInput,
} from "./favoritos.controller.js";

export const favoritosRouter = express.Router();

// CRUD dependiente: /api/clientes/:clienteId/favoritos
favoritosRouter.get("/:clienteId/favoritos", findByCliente);
favoritosRouter.post("/:clienteId/favoritos", sanitizeFavoritoInput, add);
favoritosRouter.delete("/favoritos/:id", remove);
