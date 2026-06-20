import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Categoria } from '../categoria/categoria.entity.mysql.js';
import { CategoriaSchema } from '../shared/validation/zodSchemas.js';
import { ZodError } from 'zod';

export class CategoriaSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const categorias = [
			{
				nombre: 'Sillas',
				descripcion: 'Asientos individuales de comedor, oficina y descanso.',
			},
			{
				nombre: 'Mesas',
				descripcion: 'Superficies para comer, trabajar y socializar.',
			},
			{
				nombre: 'Sofás',
				descripcion: 'Muebles cómodos para sentarse y relajarse.',
			},
			{
				nombre: 'Camas',
				descripcion: 'Muebles para dormir y descansar.',
			},
			{
				nombre: 'Almacenamiento',
				descripcion: 'Estanterías, armarios y cómodas para organizar objetos.',
			},
		];

		categorias.forEach((c) => {
			try {
				const validatedData = CategoriaSchema.parse(c);
				em.create(Categoria, validatedData);
			} catch (error) {
				if (error instanceof ZodError) {
					console.error(`❌ Error validando categoría ${c.nombre}:`, error.issues);
					throw error;
				}
				throw error;
			}
		});
		await em.flush();
		console.log('✅ Categorías creadas.');
	}
}
