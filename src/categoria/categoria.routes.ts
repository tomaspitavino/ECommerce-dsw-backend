import {Router} from 'express';
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
categoriaRouter.get('/:idCategoria', findOne);
categoriaRouter.post('/', sanitizeCategoriaInput, add);
categoriaRouter.put('/:idCategoria', sanitizeCategoriaInput, update);
categoriaRouter.patch('/:idCategoria', sanitizeCategoriaInput, update);
categoriaRouter.delete('/:idCategoria', remove);

export {categoriaRouter};
