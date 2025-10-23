import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { validate } from '../shared/validation/validateRequest.js';
import { ClienteSchema, LoginSchema } from '../shared/validation/zodSchemas.js';
import { Cliente } from './cliente.entity.mysql.js';

const em = orm.em;

export const sanitizeClientInput = validate(ClienteSchema);
export const sanitizeClientPatchInput = validate(ClienteSchema.partial());
export const sanitizeLoginInput = validate(LoginSchema);

// Función para eliminar campos sensibles antes de enviar la respuesta
export function sanitizeCliente(cliente: any) {
  const { contrasenia, ...safeData } = cliente;
  return safeData;
}

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

export async function login(req: Request, res: Response)	{ 
	try {
    const email = req.body.email;
	const cliente = await em.findOne(Cliente, { email });

	if (!cliente) {
	  return res.status(401).json({ message: 'Email o contraseña incorrecta' });
	}

	const contrasenia = req.body.contrasenia;
		const esCorrecta = (contrasenia === cliente.contrasenia)? true : false;
    /* const esCorrecta = await bcrypt.compare(contrasenia, cliente.contrasenia);  por ahora es comparacion directa, cuando usemos hash hay que cambiarlo*/

		if (!esCorrecta) {
      return res.status(401).json({ message: 'Email o contraseña incorrecta' });
    }

    const sanitizedResponse = sanitizeCliente(cliente);
    res.status(200).json({ message: '¡Inicio de sesión exitoso!', data: sanitizedResponse });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
