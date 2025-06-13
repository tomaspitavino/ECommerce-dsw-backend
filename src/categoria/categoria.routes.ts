import {Router} from 'express';
import {
	add,
	findAll,
	findOne,
	remove,
	sanitizeCharacterInput,
	update,
} from './categoria.controller.js';

const categoriaRouter = Router();

categoriaRouter.get('/', findAll);
categoriaRouter.get('/:idCategoria', findOne);
categoriaRouter.post('/', sanitizeCharacterInput, add);
categoriaRouter.put('/:idCategoria', sanitizeCharacterInput, update);
categoriaRouter.patch('/:idCategoria', sanitizeCharacterInput, update);
categoriaRouter.delete('/:idCategoria', remove);

export {categoriaRouter};
