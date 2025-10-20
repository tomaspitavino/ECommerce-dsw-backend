import { NextFunction, Request, Response } from 'express';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { Mueble } from '../mueble/mueble.entity.mysql.js';
import { orm } from '../shared/db/orm.js';
import { Favorito } from './favoritos.entity.mysql.js';

const em = orm.em;

export function sanitizeFavoritoInput(
	req: Request,
	res: Response,
	next: NextFunction
) {
	req.body.sanitizedInput = {
		cliente: req.params.id,
		mueble: req.body.muebleId,
	};

	Object.keys(req.body.sanitizedInput).forEach((key) => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key];
		}
	});
	next();
}

export async function addFavorito(req: Request, res: Response) {
	try {
		const clienteId = Number.parseInt(req.params.id); // Desde la URL
		const muebleId = Number.parseInt(req.body.muebleId); // Desde el cuerpo de la solicitud

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
		const idCliente = Number.parseInt(req.params.id);
		const cliente = await em.findOneOrFail(Cliente, { id: idCliente });
		const favoritos = await em.find(
			Favorito,
			{ cliente },
			{ populate: ['mueble'] }
		);
		res.status(200).json({ message: 'Lista de favoritos', data: favoritos });
	} catch (error: any) {
		res
			.status(500)
			.json({ message: 'Error al listar favoritos', error: error.message });
	}
}

export async function removeFavorito(req: Request, res: Response) {
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
