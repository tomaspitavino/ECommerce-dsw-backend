import {
	Collection,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	Rel,
} from '@mikro-orm/core';
import {Cliente} from '../cliente/cliente.entity.mysql.js';

@Entity()
export class Pedido {
	@PrimaryKey()
	idPedido?: string;

	@Property()
	fecha!: Date;

	@Property()
	montoTotal!: number;

	@ManyToOne(() => Cliente, {nullable: false})
	cliente!: Rel<Cliente>;
}

// 	constructor(
// 		idPedido: string,
// 		fecha: Date,
// 		montoTotal: number,
// 		cliente: Cliente[]
// 	) {
// 		this.idPedido = idPedido;
// 		this.fecha = fecha;
// 		this.montoTotal = montoTotal;
// 		this.cliente = cliente;
// 	}
// }
