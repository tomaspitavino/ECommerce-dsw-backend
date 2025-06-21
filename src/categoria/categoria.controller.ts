import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Categoria } from "./categoria.entity.mysql.js";

const em = orm.em;
async function sanitizeCharacterInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    imagen: req.body.imagen,
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
    const categorias = await em.find(Categoria, {});
    res
      .status(200)
      .json({ Message: "Todos las categorias encontrados", data: categorias });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar categorias" });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = em.findOneOrFail(Categoria, { id });
    res.status(200).json({ Message: "Categoria encontrada", data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar la categoria" });
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(Categoria, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ Message: "Categoria creada", data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear la categoria" });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, { id });
    em.assign(categoria, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ Message: "Categoria actualizada", data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar la categoria" });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, { id });
    await em.removeAndFlush(categoria);
    res.status(200).json({ Message: "Categoria eliminada", data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar la categoria" });
  }
}

export { add, findAll, findOne, remove, sanitizeCharacterInput, update };