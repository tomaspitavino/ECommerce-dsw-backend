import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Descuento } from '../descuento/descuento.entity.mysql.js';
import { DescuentoSchema } from '../shared/validation/zodSchemas.js';
import { ZodError } from 'zod';

export class DescuentoSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const descuentos = [
			{
				codigo: 'PROMO01',
				tipo: 'Cantidad',
				porcentaje: 3,
				descripcion: '3% de descuento por comprar 3 o más productos',
			},
			{
				codigo: 'PROMO02',
				tipo: 'Monto',
				porcentaje: 5,
				descripcion: '5% de descuento en compras mayores a $200',
			},
			{
				codigo: 'PROMO03',
				tipo: 'Cantidad',
				porcentaje: 10,
				descripcion: '10% de descuento por comprar 10 o más productos',
			},
			{
				codigo: 'BLACKFRIDAY',
				tipo: 'Monto',
				porcentaje: 15,
				descripcion: '15% de descuento especial Black Friday',
			},
		];

		descuentos.forEach((d) => {
			try {
				const validatedData = DescuentoSchema.parse(d);
				em.create(Descuento, validatedData);
			} catch (error) {
				if (error instanceof ZodError) {
					console.error(`❌ Error validando descuento ${d.codigo}:`, error.issues);
					throw error;
				}
				throw error;
			}
		});
		await em.flush();
		console.log('✅ Descuentos creados');
	}
}
