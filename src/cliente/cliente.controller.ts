import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { ClienteSchema } from '../shared/validation/zodSchemas.js';
import { Cliente } from './cliente.entity.mysql.js';

const em = orm.em.fork();

export const sanitizeClientInput = validate(ClienteSchema);

export async function findAll(req: Request, res: Response) {
	try {
		const clientes = await em.find(
			Cliente,
			{},
			{ populate: ['pedidos', 'favoritos'] }
		);
		res.status(200).json({ message: 'find all clientes', data: clientes });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const cliente = await em.findOneOrFail(
			Cliente,
			{ id },
			{ populate: ['pedidos', 'favoritos'] }
		);
		res.status(200).json({ message: 'find one cliente', data: cliente });
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function add(req: Request, res: Response) {
	try {
		const cliente = em.create(Cliente, req.body.validated);
		await em.flush();
		res.status(201).json({
			message: 'Cliente creado exitosamente',
			data: cliente,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const cliente = await em.findOneOrFail(Cliente, { id });
		em.assign(cliente, req.body.validated);
		await em.flush();
		res.status(200).json({
			message: 'Cliente actualizado exitosamente',
			data: cliente,
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
		const cliente = em.getReference(Cliente, id);
		await em.removeAndFlush(cliente);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}
