import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { validate } from "../shared/validation/validateRequest.js";
import { UsuarioSchema } from "../shared/validation/zodSchemas.js";
import { Usuario } from "./usuario.entity.mysql.js";

const em = orm.em;

export const sanitizeClientInput = validate(UsuarioSchema);
export const sanitizeClientPatchInput = validate(UsuarioSchema.partial());

export async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(
      Usuario,
      {},
      { populate: ["pedidos", "favoritos"] },
    );
    const safeUsuarios = usuarios.map(({ passwordHash: _, ...rest }) => rest);
    res.status(200).json({ message: "find all usuarios", data: safeUsuarios });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(
      Usuario,
      { id },
      { populate: ["pedidos", "favoritos"] },
    );
    const { passwordHash: _, ...safeData } = usuario;
    res.status(200).json({ message: "find one usuario", data: safeData });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { contrasenia, ...rest } = req.body.validated; // no le pasa la contra en texto plano
    const passwordHash = await bcrypt.hash(contrasenia, 10); // encripta la misma contra

    const usuario = em.create(Usuario, { ...rest, passwordHash }); // añade la contra hasheada al cliente
    await em.flush();

    const { passwordHash: _, ...safeData } = usuario;
    res.status(201).json({
      message: "Usuario creado exitosamente",
      data: safeData,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// En update, solo hasheamos si viene contrasenia en el body (PATCH puede no traerla):
export async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(Usuario, { id });

    const { contrasenia, ...rest } = req.body.validated;
    const updates: any = { ...rest };

    if (contrasenia) {
      updates.passwordHash = await bcrypt.hash(contrasenia, 10);
    }

    em.assign(usuario, updates);
    await em.flush();

    const { passwordHash: _, ...safeData } = usuario as any;

    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      data: safeData,
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
    const usuario = em.getReference(Usuario, id);
    await em.removeAndFlush(usuario);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function perfil(req: Request, res: Response) {
  try {
    const usuario = await em.findOneOrFail(
      Usuario,
      { id: req.user!.id },
      { populate: ["pedidos", "favoritos"] },
    );

    const { passwordHash: _, ...safeData } = usuario;

    res.status(200).json({
      message: "Perfil obtenido",
      data: safeData,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}