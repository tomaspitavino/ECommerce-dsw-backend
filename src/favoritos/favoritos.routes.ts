import express from 'express';
import {
	add,
	findByCliente,
	remove,
	sanitizeFavoritoInput,
} from './favoritos.controller.js';

const router = express.Router();

// CRUD dependiente: /api/clientes/:clienteId/favoritos
router.get('/:clienteId/favoritos', findByCliente);
router.post('/:clienteId/favoritos', sanitizeFavoritoInput, add);
router.delete('/favoritos/:id', remove);

export default router;
