import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.mysql.js";
import { validate } from "../shared/validation/validateRequest.js";
import { LoginSchema } from "../shared/validation/zodSchemas.js";
import { id } from "zod/locales";
export const sanitizeLoginInput = validate(LoginSchema);

const em = orm.em;

export async function login(req: Request, res: Response) {
  try {
    const { email, contrasenia } = req.body.validated;

    const usuario = await em.findOne(Usuario, { email });
    if (!usuario) {
      return res.status(401).json({ message: "Email o contraseña incorrecta" });
    }

    // recordar que en este punnto el cliente ya está creado
    const esCorrecta = await bcrypt.compare(contrasenia, usuario.passwordHash);
    if (!esCorrecta) {
      return res.status(401).json({ message: "Email o contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "8h" } as jwt.SignOptions,
    );

    return res.status(200).json({
      message: "¡Inicio de sesión exitoso!",
      token,
      id: usuario.id,
      rol: usuario.rol,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
