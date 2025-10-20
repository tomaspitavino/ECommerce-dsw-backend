import { NextFunction, Request, Response } from 'express';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { Item } from '../item/item.entity.mysql.js';
import { orm } from '../shared/db/orm.js';
import { Pedido } from './pedido.entity.mysql.js';

const em = orm.em;

export async function findPedidosByCliente(req: Request, res: Response) {
	try {
		const idCliente = Number.parseInt(req.params.id);
		const cliente = await em.findOneOrFail(Cliente, { id: idCliente });

		const pedidos = await em.find(
			Pedido,
			{ cliente },
			{ populate: ['items', 'pago'], orderBy: { fechaHora: 'desc' } }
		);

		res.status(200).json({
			message: `Pedidos del cliente ${idCliente}`,
			data: pedidos,
		});
	} catch (error: any) {
		res.status(500).json({
			message: 'Error al obtener los pedidos del cliente',
			error: error.message,
		});
	}
}

export async function updateEstadoPedido(req: Request, res: Response) {
	try {
		const idPedido = Number(req.params.id);
		const { nuevoEstado } = req.body;

		const pedido = await em.findOneOrFail(Pedido, { id: idPedido });

		// Definimos las transiciones permitidas como strings
		const transiciones: Record<string, string[]> = {
			pendiente: ['confirmado', 'cancelado'],
			confirmado: ['pagado', 'cancelado'],
			pagado: ['enviado'],
			enviado: ['entregado'],
			entregado: [],
			cancelado: [],
		};

		const permitidos = transiciones[pedido.estado] ?? [];

		if (!permitidos.includes(nuevoEstado)) {
			return res.status(400).json({
				message: `No se puede pasar de '${pedido.estado}' a '${nuevoEstado}'.`,
			});
		}

		pedido.estado = nuevoEstado;
		await em.flush();

		res.status(200).json({
			message: `Estado del pedido actualizado a '${nuevoEstado}'.`,
			data: pedido,
		});
	} catch (error: any) {
		res.status(500).json({
			message: 'Error al actualizar el estado del pedido',
			error: error.message,
		});
	}
}

export async function crearPedido(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const idCliente = Number(req.params.id);
		const cliente = await em.findOneOrFail(Cliente, { id: idCliente });

		// Buscar ítems del carrito del cliente
		const itemsCarrito = await em.find(
			Item,
			{ cliente, estado: 'en_carrito' },
			{ populate: ['mueble'] }
		);

		if (itemsCarrito.length === 0) {
			return res.status(400).json({ message: 'El carrito está vacío.' });
		}

		// Calcular total
		const total = itemsCarrito.reduce((acc, i) => acc + i.subtotal, 0);

		// Crear pedido
		const pedido = em.create(Pedido, {
			cliente,
			estado: 'pendiente',
			total: total,
			fechaHora: new Date(),
		});

		// Asociar ítems al pedido
		for (const item of itemsCarrito) {
			item.pedido = pedido;
			item.estado = 'pendiente';
			pedido.items.add(item);
		}

		await em.persistAndFlush(pedido);

		res.status(201).json({
			message: 'Pedido creado correctamente',
			data: pedido,
		});
	} catch (error: any) {
		next(error);
	}
}

/* | Paso | Acción                                  | Resultado                                             |
| ---- | --------------------------------------- | ----------------------------------------------------- |
| 1️⃣  | Busca ítems con `estado = 'en_carrito'` | Recupera solo el carrito del cliente                  |
| 2️⃣  | Calcula `totalPrecio`                   | Suma de `subtotal` de cada ítem                       |
| 3️⃣  | Crea el `Pedido`                        | Con `estado = 'pendiente'`                            |
| 4️⃣  | Asocia ítems al pedido                  | Cambia `estado` a `'pendiente'` y agrega al pedido    |
| 5️⃣  | Persiste todo                           | Guarda en la base de datos las referencias y el total |
 */
