import { NextFunction, Request, Response } from 'express';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { Mueble } from '../mueble/mueble.entity.mysql.js';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { favoritoSchema } from '../shared/validation/zodSchemas.js';
import { Favorito } from './favoritos.entity.mysql.js';

const em = orm.em;

/* export function sanitizeFavoritoInput(
	req: Request,
	res: Response,
	next: NextFunction
) {
	req.body.sanitizedInput = {
		cliente: req.body.id,
		mueble: req.body.id,
	};

	Object.keys(req.body.sanitizedInput).forEach((key) => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key];
		}
	});
	next();
}
 */

export const sanitizeFavoritoInput = validate(favoritoSchema);

export async function add(req: Request, res: Response) {
	try {
		const clienteId = Number.parseInt(req.body.validated);
		const muebleId = Number.parseInt(req.body.validated);

		const favorito = em.create(Favorito, {
			cliente: em.getReference(Cliente, clienteId),
			mueble: em.getReference(Mueble, muebleId),
		});

		await em.flush();
		res.status(201).json({ message: 'Favorito agregado', data: favorito });
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Error al agregar favorito', error: error.message });
	}
}

export async function findAllFavoritos(req: Request, res: Response) {
	try {
		const favoritos = await em.find(
			Favorito,
			{},
			{ populate: ['cliente', 'mueble'] }
		);
		res.status(200).json({ message: 'Lista de favoritos', data: favoritos });
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Error al listar favoritos', error: error.message });
	}
}

export async function findOneFavorito(req: Request, res: Response) {
	try {
		const favoritoId = Number.parseInt(req.params.idMueble);
		const favorito = await em.findOneOrFail(
			Favorito,
			{ id: favoritoId },
			{ populate: ['cliente', 'mueble'] }
		);
		res.status(200).json({ message: 'Favorito encontrado', data: favorito });
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Error al encontrar favorito', error: error.message });
	}
}

export async function updateFavorito(req: Request, res: Response) {
	try {
		const favoritoId = Number.parseInt(req.params.id);
		const favorito = await em.findOneOrFail(Favorito, { id: favoritoId });

		if (req.body.validated.cliente)
			favorito.cliente = em.getReference(
				Cliente,
				Number.parseInt(req.body.validated.cliente)
			);
		if (req.body.validated.mueble)
			favorito.mueble = em.getReference(
				Mueble,
				Number.parseInt(req.body.validated.mueble)
			);

		await em.flush();
		res.status(200).json({ message: 'Favorito actualizado', data: favorito });
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Error al actualizar favorito', error: error.message });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const favoritoId = Number.parseInt(req.params.id);
		const favorito = await em.findOneOrFail(Favorito, { id: favoritoId });
		await em.removeAndFlush(favorito);
		res.status(200).json({ message: 'Favorito eliminado', data: favorito });
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Error al eliminar favorito', error: error.message });
	}
}
