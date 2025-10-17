import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Descuento extends BaseEntity {
	@Property({ nullable: false })
	codigo!: string; // Ej: 'PROMO10', 'BLACKFRIDAY'

	@Enum(() => TipoDescuento)
	tipo!: TipoDescuento; // 'CANTIDAD', 'MONTO'

	@Property({ nullable: false })
	porcentaje!: number;

	@Property({ nullable: true })
	descripcion?: string;

	@Property({ type: 'datetime', nullable: true })
	fechaExpiracion?: Date;

	@ManyToOne(() => Pedido, { nullable: false })
	pedido!: Rel<Pedido>;
}

export enum TipoDescuento {
	Cantidad = 'Cantidad',
	Monto = 'Monto',
}
