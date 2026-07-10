import { Router } from "express";
import {
  cancelarPedido,
  crearPedido,
  findAllPedidos,
  findAllPedidosAdmin,
  findPedidoById,
  sanitizePedidoInput,
  updateEstadoPedido,
} from "./pedido.controller.js";
import { requireRole, verifyToken } from "../auth/auth.middleware.js";

export const pedidoRouter = Router();

// solo el usuario autenticado puede crear pedido
pedidoRouter.post("/", verifyToken, sanitizePedidoInput, crearPedido);
pedidoRouter.get(
  "/admin",
  verifyToken,
  requireRole("admin"),
  findAllPedidosAdmin,
);
pedidoRouter.get("/:clienteId", verifyToken, findAllPedidos);
pedidoRouter.get("/:clienteId/pedido/:id", verifyToken, findPedidoById);

// admin
pedidoRouter.patch(
  "/:pedidoId/estado",
  verifyToken,
  requireRole("admin"),
  updateEstadoPedido,
);
pedidoRouter.patch("/:pedidoId/cancelar", verifyToken, cancelarPedido);
