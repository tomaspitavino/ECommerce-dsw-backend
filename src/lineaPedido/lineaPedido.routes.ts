import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  remove,
  update,
  sanitizeLineaInput,
} from "./lineaPedidos.controller.js";

export const lineaPedidoRouter = Router();

lineaPedidoRouter.get("/", findAll);
lineaPedidoRouter.get("/:id", findOne);
lineaPedidoRouter.post("/", sanitizeLineaInput, add);
lineaPedidoRouter.put("/:id", sanitizeLineaInput, update);
lineaPedidoRouter.patch("/:id", sanitizeLineaInput, update);
lineaPedidoRouter.delete("/:id", remove);