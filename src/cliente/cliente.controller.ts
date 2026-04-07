import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { orm } from "../shared/db/orm.js";
import { validate } from "../shared/validation/validateRequest.js";
import { ClienteSchema, LoginSchema } from "../shared/validation/zodSchemas.js";
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
    res.status(200).json({ message: "find all clientes", data: clientes });
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
    res.status(200).json({ message: "find one cliente", data: cliente });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { contrasenia, ...rest } = req.body.validated;
    const passwordHash = await bcrypt.hash(contrasenia, 10);

    const cliente = em.create(Cliente, { ...rest, passwordHash }); // encriptar contraseña con bcrypt
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

// logica de login
// aun sin el token jwt
// export async function login(req: Request, res: Response) {
//   try {
//     const email = req.body.email;
//     const cliente = await em.findOne(Cliente, { email });
//
//     if (!cliente) {
//       return res.status(401).json({ message: "Email o contraseña incorrecta" });
//     }
//
//     const contrasenia = req.body.contrasenia;
//     const esCorrecta = contrasenia === cliente.passwordHash ? true : false;
//     /* const esCorrecta = await bcrypt.compare(contrasenia, cliente.contrasenia);  por ahora es comparacion directa, cuando usemos hash hay que cambiarlo*/
//
//     if (!esCorrecta) {
//       return res.status(401).json({ message: "Email o contraseña incorrecta" });
//     }
//
//     const sanitizedResponse = sanitizeCliente(cliente);
//     res
//       .status(200)
//       .json({ message: "¡Inicio de sesión exitoso!", data: sanitizedResponse });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }
