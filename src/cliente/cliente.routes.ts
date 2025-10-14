import { Router } from 'express';
import {
	findAllFavoritos,
	findOneFavorito,
	sanitizeFavoritoInput,
	updateFavorito,
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

clienteRouter.get('/:id/favoritos', findAllFavoritos);
clienteRouter.get('/:id/favoritos/:idMueble', findOneFavorito);
clienteRouter.patch(
	'/:id/favoritos/:idMueble',
	sanitizeFavoritoInput,
	updateFavorito
);
clienteRouter.post('/:id/favoritos/:idMueble', sanitizeFavoritoInput, add);

// CRUD independiente: /api/clientes
clienteRouter.get('/', findAll);
clienteRouter.get('/:id', findOne);
clienteRouter.post('/', sanitizeClientInput, add);
clienteRouter.put('/:id', sanitizeClientInput, update);
clienteRouter.patch('/:id', sanitizeClientInput, update);
clienteRouter.delete('/:id', remove);
