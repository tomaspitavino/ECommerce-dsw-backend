import { NotFoundError, ValidationError } from '@mikro-orm/core';
import { NextFunction, Request, Response } from 'express';

// 🚨 Errores personalizados opcionales
class HttpError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export class BadRequestError extends HttpError {
	constructor(message = 'Solicitud inválida') {
		super(400, message);
	}
}

export class NotFoundHTTPError extends HttpError {
	constructor(message = 'Recurso no encontrado') {
		super(404, message);
	}
}

export class ConflictError extends HttpError {
	constructor(message = 'Conflicto de datos') {
		super(409, message);
	}
}

export class InternalServerError extends HttpError {
	constructor(message = 'Error interno del servidor') {
		super(500, message);
	}
}

// 🧩 Middleware global
export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	console.error('[ERROR HANDLER]', err);

	// Zod validation error
	if (err.name === 'ZodError') {
		return res.status(400).json({
			message: 'Error de validación',
			errors: err.errors || err.issues,
		});
	}

	// MikroORM: entidad no encontrada
	if (err instanceof NotFoundError) {
		return res.status(404).json({
			message: 'Entidad no encontrada',
		});
	}

	// MikroORM: error de validación interna
	if (err instanceof ValidationError) {
		return res.status(400).json({
			message: err.message,
		});
	}

	// Error SQL de duplicado
	if (err.code === 'ER_DUP_ENTRY' || err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
		return res.status(409).json({
			message: 'El registro ya existe (valor duplicado)',
		});
	}

	// Errores personalizados (BadRequestError, ConflictError, etc.)
	if (err instanceof HttpError) {
		return res.status(err.status).json({ message: err.message });
	}

	// Default — cualquier otro error
	return res.status(500).json({
		message: 'Error interno del servidor',
		details: err.message,
	});
}
