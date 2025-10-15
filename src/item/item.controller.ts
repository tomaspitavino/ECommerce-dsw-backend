import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { ItemSchema } from '../shared/validation/zodSchemas.js';
import { Item } from './item.entity.mysql.js';

const em = orm.em;

/* export function sanitizeItemInput(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.body.sanitizedInput = {
        subtotal: req.body.subtotal,
        estado: req.body.estado,
        cantidad: req.body.cantidad,
        mueble: req.body.mueble,
        pedido: req.body.pedido,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
} */

export const sanitizeItemInput = validate(ItemSchema);

export async function findAll(req: Request, res: Response) {
	try {
		const items = await em.find(Item, {}, { populate: ['mueble', 'pedido'] });
		res.status(200).json({
			Message: 'Todas las líneas de pedido encontradas',
			data: items,
		});
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar líneas de pedido' });
	}
}

export async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const item = await em.findOneOrFail(
			Item,
			{ id },
			{ populate: ['mueble', 'pedido'] }
		);
		res.status(200).json({ Message: 'Línea de pedido encontrada', data: item });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar la línea de pedido' });
	}
}

export async function add(req: Request, res: Response) {
	try {
		const item = em.create(Item, req.body.validated);
		await em.flush();
		res.status(200).json({ Message: 'Línea de pedido creada', data: item });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al crear la línea de pedido' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const item = await em.findOneOrFail(Item, { id });
		em.assign(item, req.body.validated);
		await em.flush();
		res
			.status(200)
			.json({ Message: 'Línea de pedido actualizada', data: item });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al actualizar la línea de pedido' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const item = await em.findOneOrFail(Item, { id });
		await em.removeAndFlush(item);
		res.status(200).json({ Message: 'Línea de pedido eliminada' });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al eliminar la línea de pedido' });
	}
}
