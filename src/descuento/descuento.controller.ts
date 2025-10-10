import { EntityManager } from "@mikro-orm/core";
import { NextFunction, Request, Response } from "express";
import { Pedido } from "../pedido/pedido.entity.mysql.js";
import { orm } from "../shared/db/orm.js";
import { Descuento } from "./descuento.entity.mysql.js";

const em = orm.em.fork();

function resolveRelations(dto: any, em: EntityManager) {
  return {
    ...dto,
    pedido: dto.pedido ? em.getReference(Pedido, dto.pedido) : null,
  };
}

export function sanitizeDescuentoInput(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.body.sanitizedInput = {
    codigo: req.body.codigo,
    tipo: req.body.tipo,
    porcentaje: req.body.porcentaje,
    descripcion: req.body.descripcion,
    fechaExpiracion: req.body.fechaExpiracion,
    pedido: req.body.pedido,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const descuentos = await em.find(Descuento, {});
    res.status(200).json({ message: "find all descuentos", data: descuentos });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const descuento = await em.findOneOrFail(Descuento, { id });
    res.status(200).json({ message: "find one descuento", data: descuento });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const dto = req.body.sanitizedInput;
    const descuento = em.create(Descuento, resolveRelations(dto, em));

    await em.flush();
    res.status(201).json({
      message: "Descuento creado exitosamente",
      data: descuento,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const dto = req.body.sanitizedInput;
    const id = Number.parseInt(req.params.id);
    const descuento = await em.findOneOrFail(Descuento, { id });
    em.assign(descuento, resolveRelations(dto, em));

    await em.flush();
    res.status(200).json({
      message: "Descuento actualizado exitosamente",
      data: descuento,
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
    const descuentoToRemove = em.getReference(Descuento, id);
    await em.removeAndFlush(descuentoToRemove);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}
