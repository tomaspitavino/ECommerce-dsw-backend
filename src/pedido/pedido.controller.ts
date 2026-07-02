import { NextFunction, Request, Response } from "express";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { Item } from "../item/item.entity.mysql.js";
import { orm } from "../shared/db/orm.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { Pedido } from "./pedido.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import { PedidoSchema } from "../shared/validation/zodSchemas.js";
import { FilterQuery } from "@mikro-orm/core";


function parseDateStart(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  // month - 1 porque en JS los meses van de 0 a 11, no de 1 a 12
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function parseDateEnd(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  // month - 1 porque en JS los meses van de 0 a 11, no de 1 a 12
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

// Función para construir el objeto "where" para la consulta de pedidos
function serializePedido(pedido: Pedido) {
  const items = pedido.items.isInitialized()
    ? pedido.items.getItems().map((item) => ({
        id: item.id,
        cantidad: item.cantidad,
        subtotal: Number(item.subtotal),
        mueble: {
          id: item.mueble.id,
          descripcion: item.mueble.descripcion,
          etiqueta: item.mueble.etiqueta,
        },
      }))
    : [];

  const result: Record<string, unknown> = {
    id: pedido.id,
    fechaHora: pedido.fechaHora,
    estado: pedido.estado,
    total: Number(pedido.total),
    items,
  };

  if (
    pedido.usuario &&
    typeof pedido.usuario === "object" &&
    "email" in pedido.usuario
  ) {
    result.usuario = {
      id: pedido.usuario.id,
      nombre: pedido.usuario.nombre,
      apellido: pedido.usuario.apellido,
      email: pedido.usuario.email,
    };
  }

  return result;
}

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

    res.status(200).json({ data: pedidos.map(serializePedido) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function findAllPedidosAdmin(req: Request, res: Response) {
  try {
    const { fechaDesde, fechaHasta, estado } = req.query;

    const where: FilterQuery<Pedido> = {};

    if (typeof estado === "string") {
      where.estado = estado as Pedido["estado"];
    }

    if (typeof fechaDesde === "string" || typeof fechaHasta === "string") {
      where.fechaHora = {};

      if (typeof fechaDesde === "string") {
        where.fechaHora.$gte = parseDateStart(fechaDesde);
      }

      if (typeof fechaHasta === "string") {
        where.fechaHora.$lte = parseDateEnd(fechaHasta);
      }
    }

    const pedidos = await em.find(Pedido, where, {
      populate: ["items.mueble", "pago", "usuario"],
      orderBy: {
        fechaHora: "desc",
      },
    });

    res.status(200).json({
      data: pedidos.map(serializePedido),
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
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
    const nuevoEstado = req.body.estado;

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
