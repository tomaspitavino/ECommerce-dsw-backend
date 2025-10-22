import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Descuento } from '../descuento/descuento.entity.mysql.js';

export class DescuentoSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const descuentos = [
			{
				codigo: 'PROMO01',
				tipo: 'CANTIDAD',
				porcentaje: 3,
				descripcion: '3% de descuento por comprar 3 o más productos',
			},
			{
				codigo: 'PROMO02',
				tipo: 'MONTO',
				porcentaje: 5,
				descripcion: '5% de descuento en compras mayores a $200',
			},
			{
				codigo: 'PROMO03',
				tipo: 'CANTIDAD',
				porcentaje: 10,
				descripcion: '10% de descuento por comprar 10 o más productos',
			},
			{
				codigo: 'BLACKFRIDAY',
				tipo: 'MONTO',
				porcentaje: 15,
				descripcion: '15% de descuento especial Black Friday',
			},
		];

		descuentos.forEach((d) => em.create(Descuento, d));
		await em.flush();
		console.log('✅ Descuentos creados');
	}
}
