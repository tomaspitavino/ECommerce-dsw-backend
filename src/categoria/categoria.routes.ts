import { Router } from 'express';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeCategoriaInput,
	update,
} from './categoria.controller.js';

const categoriaRouter = Router();

categoriaRouter.get('/', findAll);
categoriaRouter.get('/:id', findOne);
categoriaRouter.post('/', sanitizeCategoriaInput, add);
categoriaRouter.put('/:id', sanitizeCategoriaInput, update);
categoriaRouter.patch('/:id', sanitizeCategoriaInput, update);
categoriaRouter.delete('/:id', remove);

export { categoriaRouter };
