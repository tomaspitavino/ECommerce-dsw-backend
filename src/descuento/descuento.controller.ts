import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { DescuentoSchema } from '../shared/validation/zodSchemas.js';
import { Descuento } from './descuento.entity.mysql.js';

const em = orm.em;

export const sanitizeDescuentoInput = validate(DescuentoSchema);

export async function findAll(req: Request, res: Response) {
	try {
		const descuentos = await em.find(Descuento, {});
		res.status(200).json({ message: 'find all descuentos', data: descuentos });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const descuento = await em.findOneOrFail(Descuento, { id });
		res.status(200).json({ message: 'find one descuento', data: descuento });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function add(req: Request, res: Response) {
	try {
		const dto = req.body.validated;
		const descuento = em.create(Descuento, dto);

		await em.flush();
		res.status(201).json({
			message: 'Descuento creado exitosamente',
			data: descuento,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function update(req: Request, res: Response) {
	try {
		const dto = req.body.validated;
		const id = Number.parseInt(req.params.id);
		const descuento = await em.findOneOrFail(Descuento, { id });
		em.assign(descuento, dto);

		await em.flush();
		res.status(200).json({
			message: 'Descuento actualizado exitosamente',
			data: descuento,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const descuentoToRemove = em.getReference(Descuento, id);
		await em.removeAndFlush(descuentoToRemove);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}
