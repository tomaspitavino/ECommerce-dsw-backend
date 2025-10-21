import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Categoria } from '../categoria/categoria.entity.mysql.js';
import { Material } from '../material/material.entity.mysql.js';
import { Mueble } from '../mueble/mueble.entity.mysql.js';

export class MuebleSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const categoria = await em.findOneOrFail(Categoria, {
			nombre: 'Sillas',
		});
		const material = await em.findOneOrFail(Material, {
			nombre: 'Madera maciza',
		});

		const muebles = [
			{
				descripcion: 'Cama de roble con cabecera',
				stock: 5,
				etiqueta: 'Camas',
				precioUnitario: 75000,
				imagenes: [
					'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
				],
				categoria,
				material,
			},
			{
				descripcion: 'Mesa de noche minimalista',
				stock: 8,
				etiqueta: 'Mesas',
				precioUnitario: 25000,
				imagenes: [
					'https://images.unsplash.com/photo-1626425262231-9419b7abcc98?w=800',
				],
				categoria,
				material,
			},
		];

		muebles.forEach((m) => em.create(Mueble, m));
		await em.flush();
		console.log('✅ Muebles creados.');
	}
}
