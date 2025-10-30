import { NextFunction, Request, Response } from "express";
import { Cliente } from "../cliente/cliente.entity.mysql.js";
import { Item } from "../item/item.entity.mysql.js";
import { orm } from "../shared/db/orm.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { Pedido } from "./pedido.entity.mysql.js";

const em = orm.em;

export function sanitizePedidoInput(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.body.sanitizedInput = {
    cliente: req.body.id,
    items: req.body.items,
    estado: req.body.estado,
    descuentos: req.body.descuentos,
    pago: req.body.pago,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

export async function crearPedido(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { cliente, items } = req.body.sanitizedInput;

    if (!cliente || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe enviar un cliente y al menos un item." });
    }

    // Buscar el cliente
    const clienteEntity = await em.findOneOrFail(Cliente, { id: cliente });

    // Crear el pedido base
    const pedido = em.create(Pedido, {
      cliente: clienteEntity,
      estado: "pendiente",
      fechaHora: new Date(),
      total: 0,
    });

    let totalPedido = 0;

    for (const i of items) {
      const mueble = await em.findOneOrFail(Mueble, { id: i.mueble });
      const cantidad = Number.parseInt(i.cantidad);
      const subtotal = mueble.precioUnitario * cantidad;

      const item = em.create(Item, {
        mueble,
        cantidad,
        subtotal,
        pedido,
        estado: "pendiente",
      });

      pedido.items.add(item);
      totalPedido += subtotal;
    }

    await em.persistAndFlush(pedido);

    res.status(201).json({
      message: "Pedido creado correctamente",
      data: pedido,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function findAllPedidos(req: Request, res: Response) {
  try {
    const idCliente = Number.parseInt(req.params.id);
    const cliente = await em.findOneOrFail(Cliente, { id: idCliente });

    const pedidos = await em.find(
      Pedido,
      { cliente },
      { populate: ["items.mueble", "pago"], orderBy: { fechaHora: "desc" } },
    );

    res.status(200).json({
      message: `Pedidos del cliente ${idCliente}`,
      data: pedidos,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al obtener los pedidos del cliente",
      error: error.message,
    });
  }
}

export async function updateEstadoPedido(req: Request, res: Response) {
  try {
    const idPedido = Number(req.params.id);
    const { nuevoEstado } = req.body;

    const pedido = await em.findOneOrFail(Pedido, { id: idPedido });

    // Transiciones válidas
    const transiciones: Record<string, string[]> = {
      pendiente: ["confirmado", "cancelado"],
      confirmado: ["pagado", "cancelado"],
      pagado: ["enviado"],
      enviado: ["entregado"],
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
      message: "Error al actualizar el estado del pedido",
      error: error.message,
    });
  }
}
