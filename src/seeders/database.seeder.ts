import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { CategoriaSeeder } from './categoria.seeder.js';
import { ClienteSeeder } from './cliente.seeder.js';
import { MaterialSeeder } from './material.seeder.js';
import { MuebleSeeder } from './mueble.seeder.js';

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		console.log('🌱 Ejecutando DatabaseSeeder...');

		await new ClienteSeeder().run(em);
		await new CategoriaSeeder().run(em);
		await new MaterialSeeder().run(em);
		await new MuebleSeeder().run(em);

		console.log(
			'✅ Seed completo: clientes, categorías, materiales y muebles.'
		);
	}
}
