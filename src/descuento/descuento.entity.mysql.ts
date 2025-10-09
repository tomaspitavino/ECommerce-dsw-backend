import { Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Descuento extends BaseEntity {
	@Property({ nullable: false })
	codigo!: string; // Ej: 'PROMO10', 'BLACKFRIDAY'

	@Property({ default: 'MONTO' })
	tipo!: string; // 'CANTIDAD', 'MONTO'

	@Property({ nullable: false })
	porcentaje!: number;

	@Property({ nullable: true })
	descripcion?: string;

	@Property({ type: 'datetime', nullable: true })
	fechaExpiracion?: Date;

	@ManyToOne(() => Pedido, { nullable: true })
	pedido?: Rel<Pedido> | null;
}
