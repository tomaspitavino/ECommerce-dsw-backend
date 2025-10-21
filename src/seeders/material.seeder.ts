import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Material } from '../material/material.entity.mysql.js';

export class MaterialSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const materiales = [
			{ nroMaterial: 'M001', nombre: 'Madera maciza' },
			{ nroMaterial: 'M002', nombre: 'Metal cromado' },
			{ nroMaterial: 'M003', nombre: 'Vidrio templado' },
		];

		materiales.forEach((m) => em.create(Material, m));
		await em.flush();
		console.log('✅ Materiales creados.');
	}
}
