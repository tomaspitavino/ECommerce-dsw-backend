import { Router } from 'express';
import {
	findByCliente,
	sanitizeFavoritoInput,
} from '../favoritos/favoritos.controller.js';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeClientInput,
	update,
} from './cliente.controller.js';

export const clienteRouter = Router();

clienteRouter.get('/:id/favoritos', findByCliente); // me creo un controller de favoritos mas tarde
clienteRouter.post('/:id/favoritos/:idMueble', sanitizeFavoritoInput, add); // me creo un controller de favoritos mas tarde
clienteRouter.get('/', findAll);
clienteRouter.get('/:id', findOne);
clienteRouter.post('/', sanitizeClientInput, add);
clienteRouter.put('/:id', sanitizeClientInput, update);
clienteRouter.patch('/:id', sanitizeClientInput, update);
clienteRouter.delete('/:id', remove);
