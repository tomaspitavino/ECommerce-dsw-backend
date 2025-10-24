import { Router } from 'express';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeItemInput,
	updateCantidad,
} from './item.controller.js';

export const itemRouter = Router();

itemRouter.get('/', findAll);
itemRouter.get('/:id', findOne);
itemRouter.post('/', sanitizeItemInput, add);
itemRouter.put('/:id', sanitizeItemInput, updateCantidad);
itemRouter.patch('/:id', sanitizeItemInput, updateCantidad);
itemRouter.delete('/:id', remove);

// Nueva ruta: obtener todos los items de un pedido
// itemRouter.get("/pedido/:pedidoId", findByPedido);
