import {NextFunction, Request, Response} from 'express';
import {Cliente} from './cliente.entity.js';
import {ClienteRepository} from './cliente.repository.js';

const repository = new ClienteRepository();

function sanitizeCharacterInput(
	req: Request,
	res: Response,
	next: NextFunction
) {
	req.body.sanitizedInput = {
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		direccion: req.body.direccion,
		telefono: req.body.telefono,
		dni: req.body.dni,
		usuario: req.body.usuario,
		email: req.body.email,
		contrasenia: req.body.contrasenia,
		historialCompras: req.body.historialCompras,
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

function findAll(req: Request, res: Response) {
	res.json({
		data: repository.findAll(),
	});
}

function findOne(req: Request, res: Response) {
	const id = req.params.id;
	const cliente = repository.findOne({id});
	if (!cliente) {
		return res.status(404).send({message: 'Cliente no encontrado'});
	}
	res.json({data: cliente});
}

function add(req: Request, res: Response) {
	const input = req.body.sanitizedInput;
	const clienteInput = new Cliente(
		input.nombre,
		input.apellido,
		input.direccion,
		input.telefono,
		input.dni,
		input.usuario,
		input.email,
		input.contrasenia,
		input.historialCompras,
		input.fondos,
		input.puntos,
		input.favoritos
	);

	const cliente = repository.add(clienteInput);
	return res.status(201).send({message: 'Cliente creado', data: cliente});
}

function update(req: Request, res: Response) {
	req.body.sanitizedInput.id = req.params.id;
	const cliente = repository.update({...req.body.sanitizedInput});

	if (!cliente) {
		return res.status(404).send({message: 'Cliente no encontrado'});
	}

	return res.status(200).send({message: 'Cliente actualizado', data: cliente});
}

function remove(req: Request, res: Response) {
	const id = req.params.id;
	const cliente = repository.delete({id});

	if (!cliente) {
		res.status(404).send({message: 'Cliente no encontrado'});
	}
	res.status(204).send({message: 'Cliente eliminado'});
}

export {add, findAll, findOne, remove, sanitizeCharacterInput, update};
