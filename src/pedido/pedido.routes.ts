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

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemInput:
 *       type: object
 *       required: [mueble, cantidad]
 *       properties:
 *         mueble:
 *           type: integer
 *         cantidad:
 *           type: integer
 *           minimum: 1
 *     PedidoInput:
 *       type: object
 *       required: [items]
 *       properties:
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/ItemInput'
 *     Pedido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fechaHora:
 *           type: string
 *           format: date-time
 *         estado:
 *           type: string
 *           enum: [pendiente, confirmado, pagado, enviado, entregado, cancelado]
 *         total:
 *           type: number
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               subtotal:
 *                 type: number
 *               mueble:
 *                 $ref: '#/components/schemas/Mueble'
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Stock insuficiente o datos inválidos
 *       401:
 *         description: Token requerido
 */

/**
 * @swagger
 * /api/pedidos/admin:
 *   get:
 *     summary: Obtener todos los pedidos (solo admin)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, confirmado, pagado, enviado, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Acceso denegado
 */

/**
 * @swagger
 * /api/pedidos/{clienteId}:
 *   get:
 *     summary: Obtener pedidos del cliente autenticado
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente
 *       401:
 *         description: Token requerido
 */

/**
 * @swagger
 * /api/pedidos/{clienteId}/pedido/{id}:
 *   get:
 *     summary: Obtener un pedido específico del cliente
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       401:
 *         description: Token requerido
 *       404:
 *         description: Pedido no encontrado
 */

/**
 * @swagger
 * /api/pedidos/{pedidoId}/estado:
 *   patch:
 *     summary: Cambiar estado de un pedido (solo admin)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nuevoEstado]
 *             properties:
 *               nuevoEstado:
 *                 type: string
 *                 enum: [pendiente, confirmado, pagado, enviado, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Transición de estado inválida
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Acceso denegado
 */

/**
 * @swagger
 * /api/pedidos/{pedidoId}/cancelar:
 *   patch:
 *     summary: Cancelar un pedido (cliente autenticado)
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido cancelado
 *       400:
 *         description: No se puede cancelar en el estado actual
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No podés cancelar un pedido ajeno
 */

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
