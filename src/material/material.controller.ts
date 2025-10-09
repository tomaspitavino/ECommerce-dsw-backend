import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Material } from "./material.entity.mysql.js";

const em = orm.em;

export function sanitizeMaterialInput(
  req: Request,
  res: Response,
  next: Function,
) {
  req.body.sanitizedInput = {
    nroMaterial: req.body.nroMaterial,
    nombre: req.body.nombre,
    muebles: req.body.muebles,
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
    const materiales = await em.find(Material, {});
    res
      .status(200)
      .json({ Message: "Todos los materiales encontrados", data: materiales });
  } catch (error: any) {
    res.status(500).json({ message: "Error al cargar materiales" });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const material = await em.findOneOrFail(Material, { id });
    res.status(200).json({ Message: "Material encontrado", data: material });
  } catch (error: any) {
    res.status(500).json(error);
  }
}

export async function add(req: Request, res: Response) {
  try {
    const material = em.create(Material, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ Message: "Material creado", data: material });
  } catch (error: any) {
    res.status(500).json({ message: "Error al crear el material" });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const material = await em.findOneOrFail(Material, { id });
    em.assign(material, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ Message: "Material actualizado", data: material });
  } catch (error: any) {
    res.status(500).json({ message: "Error al actualizar el material" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const material = await em.findOneOrFail(Material, { id });
    await em.removeAndFlush(material);
    res.status(200).json({ Message: "Material eliminado", data: material });
  } catch (error: any) {
    res.status(500).json({ message: "Error al eliminar el material" });
  }
}
