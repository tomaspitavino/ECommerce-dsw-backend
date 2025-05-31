import {Router} from 'express';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeCharacterInput,
	update,
} from './cliente.controller.js';

const clienteRouter = Router();

clienteRouter.get('/', findAll);
clienteRouter.get('/:id', findOne);
clienteRouter.post('/', sanitizeCharacterInput, add);
clienteRouter.put('/:id', sanitizeCharacterInput, update);
clienteRouter.patch('/:id', sanitizeCharacterInput, update);
clienteRouter.delete('/:id', remove);

export {clienteRouter};
