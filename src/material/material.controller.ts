import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { MaterialSchema } from '../shared/validation/zodSchemas.js';
import { Material } from './material.entity.mysql.js';

const em = orm.em;

export const sanitizeMaterialInput = validate(MaterialSchema);

export async function findAll(req: Request, res: Response) {
	try {
		const materiales = await em.find(Material, {});
		res
			.status(200)
			.json({ Message: 'Todos los materiales encontrados', data: materiales });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar materiales' });
	}
}

export async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const material = await em.findOneOrFail(Material, { id });
		res.status(200).json({ Message: 'Material encontrado', data: material });
	} catch (error: any) {
		res.status(500).json(error);
	}
}

export async function add(req: Request, res: Response) {
	try {
		const material = em.create(Material, req.body.validated);
		await em.flush();
		res.status(200).json({ Message: 'Material creado', data: material });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al crear el material' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const material = await em.findOneOrFail(Material, { id });
		em.assign(material, req.body.validated);
		await em.flush();
		res.status(200).json({ Message: 'Material actualizado', data: material });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al actualizar el material' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const material = await em.findOneOrFail(Material, { id });
		await em.removeAndFlush(material);
		res.status(200).json({ Message: 'Material eliminado', data: material });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al eliminar el material' });
	}
}
