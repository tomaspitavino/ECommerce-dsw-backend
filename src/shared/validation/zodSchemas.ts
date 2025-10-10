import { z } from 'zod';

const PasswordSchema = z
	.string()
	.min(8, 'La contraseña debe tener al menos 8 caracteres')
	.max(64, 'Se ha excedido el número máximo de caracteres')
	.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
	.regex(/[a-z]/, 'Debe contener al menos una minúscula')
	.regex(/[0-9]/, 'Debe contener al menos un número')
	.regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo');

export const FavoritoSchema = z.object({
	cliente: z.number(),
	mueble: z.number(),
});

export const ClienteSchema = z.object({
	nombre: z.string().min(2),
	apellido: z.string().min(2),
	direccion: z.string(),
	telefono: z.string().min(8),
	dni: z.string().min(9),
	usuario: z.string().min(3),
	email: z.email(),
	contrasenia: z.string().min(8).max(64),
	fondos: z.number().nonnegative(),
	puntos: z.number().nonnegative(),
});

export const CategoriaSchema = z.object({
	nombre: z.string().min(2),
	descripcion: z.string().min(5).max(255),
	imagen: z.url(),
	grupoVisual: z.string().optional(),
});

export const MaterialSchema = z.object({
	nroMaterial: z.string().min(1),
	nombre: z.string().min(2),
});
