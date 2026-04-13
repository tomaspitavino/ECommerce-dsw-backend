import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { orm } from "../shared/db/orm.js";
import { validate } from "../shared/validation/validateRequest.js";
import { ClienteSchema } from "../shared/validation/zodSchemas.js";
import { Cliente } from "./cliente.entity.mysql.js";

const em = orm.em;

export const sanitizeClientInput = validate(ClienteSchema);
export const sanitizeClientPatchInput = validate(ClienteSchema.partial());

export async function findAll(req: Request, res: Response) {
  try {
    const clientes = await em.find(
      Cliente,
      {},
      { populate: ["pedidos", "favoritos"] },
    );
    const safeClientes = clientes.map(({ passwordHash: _, ...rest }) => rest);
    res.status(200).json({ message: "find all clientes", data: safeClientes });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const cliente = await em.findOneOrFail(
      Cliente,
      { id },
      { populate: ["pedidos", "favoritos"] },
    );
    const { passwordHash: _, ...safeData } = cliente;
    res.status(200).json({ message: "find one cliente", data: safeData });
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

    const cliente = em.create(Cliente, { ...rest, passwordHash }); // añade la contra hasheada al cliente
    await em.flush();

    const { passwordHash: _, ...safeData } = cliente;
    res.status(201).json({
      message: "Cliente creado exitosamente",
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
    const cliente = await em.findOneOrFail(Cliente, { id });

    const { contrasenia, ...rest } = req.body.validated;
    const updates: any = { ...rest };

    if (contrasenia) {
      updates.passwordHash = await bcrypt.hash(contrasenia, 10);
    }

    em.assign(cliente, updates);
    await em.flush();

    const { passwordHash: _, ...safeData } = cliente as any;

    res.status(200).json({
      message: "Cliente actualizado exitosamente",
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
    const cliente = em.getReference(Cliente, id);
    await em.removeAndFlush(cliente);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}
