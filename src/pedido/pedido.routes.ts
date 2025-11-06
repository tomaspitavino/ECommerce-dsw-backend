import { Router } from 'express';
import {
	crearPedido,
	findAllPedidos,
	findPedidoById,
	sanitizePedidoInput,
	updateEstadoPedido,
} from './pedido.controller.js';

export const pedidoRouter = Router();

pedidoRouter.post('/', sanitizePedidoInput, crearPedido);

pedidoRouter.get('/:clienteId', findAllPedidos);
pedidoRouter.get('/:clienteId/pedido/:id', findPedidoById);
pedidoRouter.patch('/:pedidoId/estado', updateEstadoPedido);
