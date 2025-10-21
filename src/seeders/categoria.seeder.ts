import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Categoria } from '../categoria/categoria.entity.mysql.js';

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

		categorias.forEach((c) => em.create(Categoria, c));
		await em.flush();
		console.log('✅ Categorías creadas.');
	}
}
