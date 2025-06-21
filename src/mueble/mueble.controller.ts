import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Mueble } from "./mueble.entity.mysql.js";

const em = orm.em;

function sanitizeCharacterInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    imagen: req.body.imagen,
    categoria: req.body.categoria,
    material: req.body.material,
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
    const muebles = await em.find(
      Mueble,
      {},
      { populate: ["categoria", "material"] }
    );
    res
      .status(200)
      .json({ Message: "Todos los muebles encontrados", data: muebles });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar muebles" });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mueble = await em.findOneOrFail(
      Mueble,
      { id },
      { populate: ["categoria", "material"] }
    );
    res.status(200).json({ Message: "Mueble encontrado", data: mueble });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar el mueble" });
  }
}

async function add(req: Request, res: Response) {
  try {
    const mueble = em.create(Mueble, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ Message: "Mueble creado", data: mueble });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear el mueble" });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mueble = await em.findOneOrFail(Mueble, { id });
    em.assign(mueble, req.body.sanitizeizedInput);
    await em.flush();
    res.status(200).json({ Message: "Mueble actualizado", data: mueble });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar el mueble" });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const mueble = await em.findOneOrFail(Mueble, { id });
    await em.removeAndFlush(mueble);
    res.status(200).json({ Message: "Mueble eliminado", data: mueble });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar el mueble" });
  }
}

export { findAll, findOne, add, update, remove, sanitizeCharacterInput };