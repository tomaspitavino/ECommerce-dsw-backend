import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { orm } from "../shared/db/orm.js";
import { Cliente } from "../cliente/cliente.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import { LoginSchema } from "../shared/validation/zodSchemas.js";
export const sanitizeLoginInput = validate(LoginSchema);

const em = orm.em;

export async function login(req: Request, res: Response) {
  try {
    const { email, contrasenia } = req.body.validated;

    const cliente = await em.findOne(Cliente, { email });
    if (!cliente) {
      return res.status(401).json({ message: "Email o contraseña incorrecta" });
    }

    const esCorrecta = await bcrypt.compare(contrasenia, cliente.passwordHash);
    if (!esCorrecta) {
      return res.status(401).json({ message: "Email o contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: cliente.id, rol: cliente.rol },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "8h" },
    );

    return res
      .status(200)
      .json({ message: "¡Inicio de sesión exitoso!", token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
