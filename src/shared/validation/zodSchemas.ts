import { z } from 'zod';

const PasswordSchema = z
	.string()
	.min(8, 'La contraseña debe tener al menos 8 caracteres')
	.max(64, 'Se ha excedido el número máximo de caracteres')
	.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
	.regex(/[a-z]/, 'Debe contener al menos una minúscula')
	.regex(/[0-9]/, 'Debe contener al menos un número')
	.regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo');

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
});

export const CategoriaSchema = z.object({
	nombre: z.string().min(2),
	descripcion: z.string().min(5).max(255),
	imagen: z.url(),
});

export const MaterialSchema = z.object({
	nroMaterial: z.string().min(1),
	nombre: z.string().min(2),
});

export const MuebleSchema = z.object({
	descripcion: z.string().min(10).max(500),
	stock: z.number().int().nonnegative(),
	etiqueta: z.string().min(2).max(50),
	precioUnitario: z.number().nonnegative(),
	imagenes: z.array(z.url()).min(1),
	categoria: z.number().int().nonnegative(),
	material: z.number().int().nonnegative(),
	item: z.number().int().nonnegative().optional(),
});

export const ItemSchema = z.object({
	subtotal: z.number().nonnegative(),
	estado: z
		.enum(['en carrito', 'pendiente', 'en proceso', 'completado', 'cancelado'])
		.default('en carrito'),
	cantidad: z.number().int().nonnegative(),
	mueble: z.number().int().nonnegative(),
	pedido: z.number().int().nonnegative(),
});

const datetime = z.iso.datetime();

export const DescuentoSchema = z.object({
	codigo: z.string().min(2),
	tipo: z.enum(['Cantidad', 'Monto']),
	porcentaje: z.number().min(0).max(100),
	descripcion: z.string().min(5).max(255).optional(),
	fechaExpiracion: datetime.optional(), // ISO date string
	pedido: z.number().int().nonnegative().optional(),
});
