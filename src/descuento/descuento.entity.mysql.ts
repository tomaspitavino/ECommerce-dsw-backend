import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Descuento extends BaseEntity {
	@Property()
	codigo!: string; // Ej: 'PROMO10', 'BLACKFRIDAY'

	@Property()
	tipo!: string; // 'CANTIDAD', 'MONTO'

	@Property()
	porcentaje!: number;

	@Property()
	descripcion?: string;

	@Property({ nullable: true })
	fechaExpiracion?: Date = new Date();

	@ManyToOne(() => Pedido, { nullable: true })
	pedido?: Rel<Pedido>;
}

/* export enum TipoDescuento {
	Cantidad = 'Cantidad',
	Monto = 'Monto',
} */
