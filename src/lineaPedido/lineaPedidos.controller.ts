import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { lineaPedido } from "./lineaPedido.entity.mysql.js";

const em = orm.em;

function sanitizeLineaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    subtotal: req.body.subtotal,
    estado: req.body.estado,
    cantidad: req.body.cantidad,
    mueble: req.body.mueble,
    pedido: req.body.pedido,
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
    const lineas = await em.find(
      lineaPedido,
      {},
      { populate: ["mueble", "pedido"] }
    );
    res
      .status(200)
      .json({ Message: "Todas las líneas de pedido encontradas", data: lineas });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar líneas de pedido" });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const linea = await em.findOneOrFail(
      lineaPedido,
      { id },
      { populate: ["mueble", "pedido"] }
    );
    res.status(200).json({ Message: "Línea de pedido encontrada", data: linea });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar la línea de pedido" });
  }
}

async function add(req: Request, res: Response) {
  try {
    const linea = em.create(lineaPedido, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ Message: "Línea de pedido creada", data: linea });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear la línea de pedido" });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const linea = await em.findOneOrFail(lineaPedido, { id });
    em.assign(linea, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ Message: "Línea de pedido actualizada", data: linea });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar la línea de pedido" });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const linea = await em.findOneOrFail(lineaPedido, { id });
    await em.removeAndFlush(linea);
    res.status(200).json({ Message: "Línea de pedido eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar la línea de pedido" });
  }
}

export {  findAll,  findOne,  add,  update, remove,  sanitizeLineaInput };