import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Descuento extends BaseEntity {
	@Property()
	codigo!: string; // Ej: 'PROMO10', 'BLACKFRIDAY'

	@Enum(() => TipoDescuento)
	tipo!: TipoDescuento; // 'CANTIDAD', 'MONTO'

	@Property()
	porcentaje!: number;

	@Property()
	descripcion?: string;

	@Property()
	fechaExpiracion?: Date = new Date();

	@ManyToOne(() => Pedido)
	pedido!: Rel<Pedido>;
}

export enum TipoDescuento {
	Cantidad = 'Cantidad',
	Monto = 'Monto',
}
