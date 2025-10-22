import { NextFunction, Request, Response } from 'express';
import { Mueble } from '../mueble/mueble.entity.mysql.js';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { orm } from '../shared/db/orm.js';
import { Item } from './item.entity.mysql.js';

const em = orm.em;

export function sanitizeItemInput(
	req: Request,
	res: Response,
	next: NextFunction
) {
	req.body.sanitizedInput = {
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
}

export async function findAll(req: Request, res: Response) {
	try {
		const items = await em.find(Item, {}, { populate: ['mueble', 'pedido'] });
		res.status(200).json({
			Message: 'Todos items encontrados',
			data: items,
		});
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar items' });
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
		res.status(200).json({ Message: 'Item encontrado', data: item });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al cargar el item' });
	}
}

export async function add(req: Request, res: Response) {
	try {
		const mueble = await em.findOneOrFail(Mueble, {
			id: req.body.sanitizedInput.mueble,
		});

		const subtotal = mueble.precioUnitario * req.body.sanitizedInput.cantidad;
		const item = em.create(Item, {
			...req.body.sanitizedInput,
			subtotal,
		});

		await em.flush();
		res.status(200).json({ Message: 'Item creado', data: item });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al crear el item' });
	}
}

export async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const item = await em.findOneOrFail(Item, { id });
		em.assign(item, req.body.sanitizedInput);
		await em.flush();
		res.status(200).json({ Message: 'Item actualizado', data: item });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al actualizar el item' });
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const item = await em.findOneOrFail(Item, { id });

		await em.removeAndFlush(item);
		res.status(200).json({ Message: 'Item eliminado' });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al eliminar el item' });
	}
} /* 
export async function findByPedido(req: Request, res: Response) {
	try {
		const pedidoId = Number(req.params.pedidoId);
		const items = await em.find(
			Item,
			{ pedido: pedidoId },
			{ populate: ['mueble'] }
		);
		res.status(200).json({ message: 'Items del pedido', data: items });
	} catch (error: any) {
		res.status(500).json({ message: error.message });
	}
}
 */
