import {NextFunction, Request, Response} from 'express';
import {orm} from '../shared/db/orm.js';
import {Cliente} from './cliente.entity.mysql.js';

const em = orm.em;

function sanitizeClientInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		direccion: req.body.direccion,
		telefono: req.body.telefono,
		dni: req.body.dni,
		usuario: req.body.usuario,
		email: req.body.email,
		contrasenia: req.body.contrasenia,
		pedidos: req.body.pedidos,
		// historialCompras: req.body.historialCompras,
		fondos: req.body.fondos,
		puntos: req.body.puntos,
		favoritos: req.body.favoritos,
	};

	Object.keys(req.body.sanitizedInput).forEach((key) => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key];
		}
	});
	next();
}

async function findAll(req: Request, res: Response) {
	try {
		const clientes = await em.find(Cliente, {}, {populate: ['pedidos']});
		res.status(200).json({message: 'find all clientes', data: clientes});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const cliente = await em.findOneOrFail(
			Cliente,
			{id},
			{populate: ['pedidos']}
		);
		res.status(200).json({message: 'find one cliente', data: cliente});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

async function add(req: Request, res: Response) {
	try {
		const cliente = em.create(Cliente, req.body.sanitizedInput);
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

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const clienteToUpdate = await em.findOneOrFail(Cliente, {id});
		em.assign(clienteToUpdate, req.body.sanitizedInput);
		await em.flush();
		res.status(200).json({
			message: 'Cliente actualizado exitosamente',
			data: clienteToUpdate,
		});
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const clienteToRemove = em.getReference(Cliente, id);
		await em.removeAndFlush(clienteToRemove);
	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
}

export {add, findAll, findOne, remove, sanitizeClientInput, update};
