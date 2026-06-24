import { NextFunction, Request, Response } from "express";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { Item } from "../item/item.entity.mysql.js";
import { orm } from "../shared/db/orm.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { Pedido } from "./pedido.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import { PedidoSchema } from "../shared/validation/zodSchemas.js";

const em = orm.em;

export const sanitizePedidoInput = validate(PedidoSchema);

export async function crearPedido(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { items } = req.body.validated;

    // Buscar el cliente
    const cliente = await em.findOneOrFail(Usuario, {
      id: req.user!.id,
    });

    // Crear el pedido base
    const pedido = em.create(Pedido, {
      usuario: cliente,
      estado: "pendiente",
      fechaHora: new Date(),
      total: 0,
    });

    let total = 0;

    for (const i of items) {
      const mueble = await em.findOneOrFail(Mueble, { id: i.mueble });
      const subtotal = mueble.precioUnitario * i.cantidad;

      const item = em.create(Item, {
        mueble,
        cantidad: i.cantidad,
        subtotal,
        pedido,
        estado: "pendiente",
      });

      pedido.items.add(item);
      total += subtotal;
    }

    pedido.total = total;
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
  const usuario = await em.findOneOrFail(Usuario, { id: req.user!.id });

  try {
    const pedidos = await em.find(
      Pedido,
      { usuario },
      {
        populate: ["items.mueble", "pago"],
        orderBy: { fechaHora: "desc" },
      },
    );

    res.status(200).json({ data: pedidos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function findPedidoById(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.pedidoId);
    const pedido = await em.findOneOrFail(
      Pedido,
      { id },
      { populate: ["items.mueble", "pago"] },
    );

    res.status(200).json({
      message: `Pedido ${id}`,
      data: pedido,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error al obtener el pedido",
      error: error.message,
    });
  }
}

export async function updateEstadoPedido(req: Request, res: Response) {
  try {
    const id = Number(req.params.pedidoId);
    const { nuevoEstado } = req.body;

    const pedido = await em.findOneOrFail(Pedido, { id });

    const transiciones: Record<string, string[]> = {
      pendiente: ["confirmado", "cancelado"],
      confirmado: ["pagado", "cancelado"],
      pagado: ["enviado"],
      enviado: ["entregado"],
      entregado: [],
      cancelado: [],
    };

    // const permitidos = transiciones[pedido.estado] ?? [];

    // if (!permitidos.includes(nuevoEstado)) {
    //   return res.status(400).json({
    //     message: `No se puede pasar de '${pedido.estado}' a '${nuevoEstado}'.`,
    //   });
    // }

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
