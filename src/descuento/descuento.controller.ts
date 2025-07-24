import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Descuento } from './descuento.entity.mysql.js';

const em = orm.em;

function sanitizeDescuentoInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        tipoDescuento: req.body.tipoDescuento,
        porcentajeDescuento: req.body.porcentajeDescuento,
        clientes: req.body.clientes,
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
        const descuentos = await em.find(Descuento, {});
        res.status(200).json({ message: 'find all descuentos', data: descuentos });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const descuento = await em.findOneOrFail(
            Descuento,
            { id },
        );
        res.status(200).json({ message: 'find one descuento', data: descuento });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
}

async function add(req: Request, res: Response) {
    try {
        const descuento = em.create(Descuento, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({
            message: 'Descuento creado exitosamente',
            data: descuento,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const descuentoToUpdate = await em.findOneOrFail(Descuento, { id });
        em.assign(descuentoToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({
            message: 'Descuento actualizado exitosamente',
            data: descuentoToUpdate,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const descuentoToRemove = em.getReference(Descuento, id);
        await em.removeAndFlush(descuentoToRemove);
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
}

export { add, findAll, findOne, remove, sanitizeDescuentoInput, update };
