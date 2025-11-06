import {
	Cascade,
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	Property,
	Rel,
} from '@mikro-orm/core';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { Descuento } from '../descuento/descuento.entity.mysql.js';
import { Item } from '../item/item.entity.mysql.js';
import { Pago } from '../pago/pago.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

/*
pendiente → confirmado → pagado → enviado → entregado
                 ↘ cancelado */

@Entity()
export class Pedido extends BaseEntity {
	@ManyToOne(() => Cliente)
	cliente!: Rel<Cliente>;

	@OneToMany(() => Item, (item) => item.pedido, {
		cascade: [Cascade.ALL],
	})
	items = new Collection<Item>(this);

	@Property()
	fechaHora = new Date();

	@Property({ default: 'pendiente' })
	estado!:
		| 'pendiente'
		| 'confirmado'
		| 'pagado'
		| 'enviado'
		| 'entregado'
		| 'cancelado';

	// Total sin descuentos
	// Se calcula como la suma de (precio * cantidad) de cada línea
	@Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
	total!: number;

	@OneToMany(() => Descuento, (d) => d.pedido, {
		cascade: [Cascade.PERSIST],
		orphanRemoval: false, // no borra descuentos al eliminar pedido
	})
	descuentos = new Collection<Descuento>(this);

	@ManyToOne(() => Pago, { nullable: true })
	pago?: Rel<Pago>;
}
