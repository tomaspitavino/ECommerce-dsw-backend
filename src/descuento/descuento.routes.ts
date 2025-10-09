import { Router } from 'express';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeDescuentoInput,
	update,
} from './descuento.controller.js';

export const descuentoRouter = Router();

descuentoRouter.get('/', findAll);
descuentoRouter.get('/:id', findOne);
descuentoRouter.post('/', sanitizeDescuentoInput, add);
descuentoRouter.put('/:id', sanitizeDescuentoInput, update);
descuentoRouter.patch('/:id', sanitizeDescuentoInput, update);
descuentoRouter.delete('/:id', remove);
