/*
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Cliente } from '../cliente/cliente.entity.js';
import { orm } from '../shared/db/orm.js';
import { RolSchema } from './auth.schema.js';

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const em = orm.em.fork();

    const cliente = await em.findOne(Cliente, { email });

    if (!cliente)
        return res.status(401).json({ message: 'Credenciales inválidas' });

    const validPassword = await bcrypt.compare(password, cliente.passwordHash);

    if (!validPassword)
        return res.status(401).json({ message: 'Credenciales inválidas' });

    // ✅ valida rol desde DB
    const rol = RolSchema.parse(cliente.rol);

    const token = jwt.sign(
        {
            clienteId: cliente.id,
            rol,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );

    res.json({
        token,
        cliente: {
            id: cliente.id,
            email: cliente.email,
            rol,
        },
    });
}
*/
