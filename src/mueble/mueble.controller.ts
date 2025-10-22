import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { MuebleSchema } from '../shared/validation/zodSchemas.js';
import { Mueble } from './mueble.entity.mysql.js';

const em = orm.em;

export const sanitizeMuebleInput = validate(MuebleSchema);

export async function findAll(req: Request, res: Response) {
	try {
		const muebles = await em.find(
			Mueble,
			{},
			{ populate: ['categoria', 'material'] }
		);
		res
			.status(200)
			.json({ Message: 'Todos los muebles encontrados', data: muebles });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar muebles' });
	}
}

export async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const mueble = await em.findOneOrFail(
			Mueble,
			{ id },
			{ populate: ['categoria', 'material'] }
		);
		res.status(200).json({ Message: 'Mueble encontrado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar el mueble' });
	}
}

export async function add(req: Request, res: Response) {
	try {
		const dto = req.body.validated;
		const mueble = em.create(Mueble, dto);

		await em.flush();
		res.status(200).json({ Message: 'Mueble creado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al crear el mueble' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const dto = req.body.validated;

		const mueble = await em.findOneOrFail(Mueble, { id });
		em.assign(mueble, dto);

		await em.flush();
		res.status(200).json({ Message: 'Mueble actualizado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al actualizar el mueble' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const mueble = await em.findOneOrFail(Mueble, { id });

		await em.removeAndFlush(mueble);
		res.status(200).json({ Message: 'Mueble eliminado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al eliminar el mueble' });
	}
}
