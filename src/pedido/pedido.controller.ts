import { NextFunction, Request, Response } from "express";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { Item } from "../item/item.entity.mysql.js";
import { orm } from "../shared/db/orm.js";
import { Mueble } from "../mueble/mueble.entity.mysql.js";
import { Pedido } from "./pedido.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import {
  estadoPedido,
  PedidoSchema,
  updateEstadoPedidoSchema,
} from "../shared/validation/zodSchemas.js";
import { FilterQuery } from "@mikro-orm/core";
// orm.em viene tipado como el EntityManager genérico de @mikro-orm/core,
// que no expone getKnex() ni otros métodos SQL. Se importa el tipo del
// driver para castear y poder usar knex.raw() en descuentos atómicos.
import type { EntityManager as SqlEntityManager } from "@mikro-orm/mysql";

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

class PedidoValidationError extends Error {}

const em = orm.em as SqlEntityManager;

export const sanitizePedidoInput = validate(PedidoSchema);
export const validateUpdateEstadoPedidoInput = validate(
  updateEstadoPedidoSchema,
);

export async function crearPedido(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { items } = req.body.validated;

    const cantidadPorMueble = new Map<number, number>();
    for (const i of items) {
      cantidadPorMueble.set(
        i.mueble,
        (cantidadPorMueble.get(i.mueble) ?? 0) + i.cantidad,
      );
    }

    const pedidoCreado = await em.transactional(async (tem) => {
      const cliente = await tem.findOneOrFail(Usuario, {
        id: req.user!.id,
      });

      const pedido = tem.create(Pedido, {
        usuario: cliente,
        estado: "pendiente",
        fechaHora: new Date(),
        total: 0,
      });

      let total = 0;

      for (const [muebleId, cantidadTotal] of cantidadPorMueble) {
        const mueble = await tem.findOne(Mueble, {
          id: muebleId,
          activo: true,
        });
        if (!mueble) {
          throw new PedidoValidationError(
            "Uno o más productos no están disponibles",
          );
        }

        // solo resta stock si sigue habiendo suficiente
        const knex = tem.getKnex();
        const filasAfectadas = await tem.nativeUpdate(
          Mueble,
          { id: mueble.id, stock: { $gte: cantidadTotal } },
          {
            stock: knex.raw("stock - ?", [cantidadTotal]) as unknown as number,
          },
        );

        if (filasAfectadas === 0) {
          throw new PedidoValidationError(
            `Stock insuficiente para "${mueble.etiqueta}".`,
          );
        }

        // Repartir la cantidad consolidada de vuelta en ítems individuales
        // por cada línea original pedida para ese mueble.
        const subtotalUnitario = mueble.precioUnitario;
        for (const i of items) {
          if (i.mueble !== muebleId) continue;

          const subtotal = subtotalUnitario * i.cantidad;

          const item = tem.create(Item, {
            mueble,
            cantidad: i.cantidad,
            subtotal,
            pedido,
            estado: "pendiente",
          });

          pedido.items.add(item);
          total += subtotal;
        }
      }

      pedido.total = total;
      await tem.persistAndFlush(pedido);

      return pedido;
    });

    res.status(201).json({
      message: "Pedido creado correctamente",
      data: pedidoCreado,
    });
  } catch (error: any) {
    if (error instanceof PedidoValidationError) {
      return res.status(400).json({ message: error.message });
    }
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
    const usuario = await em.findOneOrFail(Usuario, { id: req.user!.id });

    const pedido = await em.findOneOrFail(
      Pedido,
      {
        id,
        usuario,
      },
      { populate: ["items.mueble", "pago"] },
    );

    res.status(200).json({
      message: `Pedido ${id}`,
      data: pedido,
    });
  } catch (error: any) {
    res.status(404).json({
      message: "Error al obtener el pedido"
    });
  }
}

export async function updateEstadoPedido(req: Request, res: Response) {
  try {
    const id = Number(req.params.pedidoId);
    const nuevoEstado = req.body.estado as estadoPedido;

    console.log("ID:", id);
    console.log("Estado recibido:", nuevoEstado);

    const transiciones: Record<estadoPedido, estadoPedido[]> = {
      pendiente: ["confirmado", "cancelado"],
      confirmado: ["pagado", "cancelado"],
      pagado: ["enviado"],
      enviado: ["entregado"],
      entregado: [],
      cancelado: [],
    };

    if (nuevoEstado === "pagado") {
      return res.status(400).json({
        message:
          "El estado 'pagado' debe procesarse mediante el flujo de confirmación de pagos",
      });
    }

    const pedido = await em.findOneOrFail(Pedido, { id });

    const transicionesValidas =
      transiciones[pedido.estado as estadoPedido] || [];

    console.log("Transiciones válidas:", transicionesValidas);

    if (!transicionesValidas.includes(nuevoEstado)) {
      console.log("TRANSICIÓN INVÁLIDA");

      return res.status(400).json({
        message: `Transición de estado inválida: no se puede pasar de '${pedido.estado}' a '${nuevoEstado}'.`,
      });
    }

    pedido.estado = nuevoEstado;
    await em.flush();

    return res.status(200).json({
      message: `Estado del pedido actualizado a '${nuevoEstado}'.`,
      data: pedido,
    });
  } catch (error: any) {
    console.error("ERROR REAL:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function cancelarPedido(req: Request, res: Response) {
  try {
    const id = Number(req.params.pedidoId);
    const pedido = await em.findOneOrFail(
      Pedido,
      { id },
      { populate: ["items.mueble"] },
    );

    // Solo el propio usuario puede cancelar
    if (pedido.usuario.id !== req.user!.id) {
      return res
        .status(403)
        .json({ message: "No podés cancelar un pedido ajeno" });
    }

    const cancelables = ["pendiente", "confirmado"];
    if (!cancelables.includes(pedido.estado)) {
      return res.status(400).json({
        message: `No se puede cancelar un pedido en estado '${pedido.estado}'`,
      });
    }

    // Devolver stock al cancelar
    for (const item of pedido.items.getItems()) {
      item.mueble.stock += item.cantidad;
    }

    pedido.estado = "cancelado";
    await em.flush();

    res.status(200).json({ message: "Pedido cancelado", data: pedido });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        message: "Pedido no encontrado",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }
}