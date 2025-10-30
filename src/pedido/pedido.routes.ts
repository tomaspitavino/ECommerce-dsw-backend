import { Router } from "express";
import {
  crearPedido,
  findAllPedidos,
  updateEstadoPedido,
} from "./pedido.controller.js";
import { sanitizePedidoInput } from "./pedido.controller.js";

export const pedidoRouter = Router();

pedidoRouter.post("/", sanitizePedidoInput, crearPedido);
pedidoRouter.get("/cliente/:id", findAllPedidos);
pedidoRouter.patch("/:id/estado", updateEstadoPedido);
