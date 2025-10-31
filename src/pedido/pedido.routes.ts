import { Router } from "express";
import {
  crearPedido,
  findAllPedidos,
  updateEstadoPedido,
  findPedidoById,
} from "./pedido.controller.js";
import { sanitizePedidoInput } from "./pedido.controller.js";

export const pedidoRouter = Router();

pedidoRouter.post("/", sanitizePedidoInput, crearPedido);
pedidoRouter.get("/:clienteId", findAllPedidos);
pedidoRouter.get("/:clienteId/pedido/:id", findPedidoById);
pedidoRouter.patch("/:id/estado", updateEstadoPedido);
