import { EntityManager } from '@mikro-orm/core';
import { NextFunction, Request, Response } from 'express';
import { Categoria } from '../categoria/categoria.entity.mysql.js';
import { Material } from '../material/material.entity.mysql.js';
import { orm } from '../shared/db/orm.js';
import { Mueble } from './mueble.entity.mysql.js';

// const em = orm.em;
const em = orm.em.fork();

function sanitizeMuebleInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		descripcion: req.body.descripcion,
		stock: req.body.stock,
		etiqueta: req.body.etiqueta,
		precioUnitario: req.body.precioUnitario,
		imagenes: req.body.imagenes,
		categoria: req.body.categoria,
		material: req.body.material,
		linea: req.body.linea,
	};

	Object.keys(req.body.sanitizedInput).forEach((key) => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key];
		}
	});
	next();
}

function resolveRelations(dto: any, em: EntityManager) {
	return {
		...dto,
		categoria: dto.categoria ? em.getReference(Categoria, dto.categoria) : null,
		material: dto.material ? em.getReference(Material, dto.material) : null,
	};
}

async function findAll(req: Request, res: Response) {
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

async function findOne(req: Request, res: Response) {
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

async function add(req: Request, res: Response) {
	try {
		const dto = req.body.sanitizedInput;
		const mueble = em.create(Mueble, resolveRelations(dto, em));

		await em.persistAndFlush(mueble);
		res.status(200).json({ Message: 'Mueble creado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al crear el mueble' });
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const dto = req.body.sanitizedInput;

		const mueble = await em.findOneOrFail(Mueble, { id });
		em.assign(mueble, resolveRelations(dto, em));

		await em.flush();
		res.status(200).json({ Message: 'Mueble actualizado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al actualizar el mueble' });
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id);
		const mueble = await em.findOneOrFail(Mueble, { id });
		await em.removeAndFlush(mueble);
		res.status(200).json({ Message: 'Mueble eliminado', data: mueble });
	} catch (error: any) {
		res.status(500).json({ message: 'Error al eliminar el mueble' });
	}
}

export { add, findAll, findOne, remove, sanitizeMuebleInput, update };
