import { Router } from 'express';
import { validate } from '../shared/validation/validateRequest.js';
import { EstadoPedidoSchema } from '../shared/validation/zodSchemas.js';
import {
	crearPedido,
	findPedidosByCliente,
	updateEstadoPedido,
} from './pedido.controller.js';

export const pedidoRouter = Router();

// Obtener pedidos de un cliente
pedidoRouter.get('/clientes/:id/pedidos', findPedidosByCliente);
pedidoRouter.post('/clientes/:id/pedidos', crearPedido);
// Actualizar estado de un pedido
pedidoRouter.patch(
	'/:id/estado',
	validate(EstadoPedidoSchema),
	updateEstadoPedido
);
