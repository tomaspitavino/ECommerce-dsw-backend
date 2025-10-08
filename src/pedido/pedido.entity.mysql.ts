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
import { lineaPedido } from '../lineaPedido/lineaPedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Pedido extends BaseEntity {
	@ManyToOne(() => Cliente, { nullable: false })
	cliente!: Rel<Cliente>;

	// Estoy considerando que la entidad lineaPedido es una relación con atributos entre Cliente y Pedido
	@OneToMany(() => lineaPedido, (linea) => linea.pedido, {
		cascade: [Cascade.ALL],
	})
	lineas = new Collection<lineaPedido>(this);

	@Property()
	fechaHora!: Date;

	@Property({ default: 'pendiente' })
	estado!: string;

	@Property()
	total!: number;

	// 🟩 Nuevo campo: descuento aplicado al total del pedido
	@Property({ type: 'float', default: 0 })
	descuento!: number; // expresado como porcentaje (por ejemplo, 10 = 10%)
	// pedido.total = subtotal * (1 - pedido.descuento / 100); calculo de descuento
}
