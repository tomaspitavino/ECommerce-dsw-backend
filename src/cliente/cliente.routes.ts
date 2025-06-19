import {Router} from 'express';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeClientInput,
	update,
} from './cliente.controller.js';

export const clienteRouter = Router();

clienteRouter.get('/', findAll);
clienteRouter.get('/:id', findOne);
clienteRouter.post('/', sanitizeClientInput, add);
clienteRouter.put('/:id', sanitizeClientInput, update);
clienteRouter.patch('/:id', sanitizeClientInput, update);
clienteRouter.delete('/:id', remove);
