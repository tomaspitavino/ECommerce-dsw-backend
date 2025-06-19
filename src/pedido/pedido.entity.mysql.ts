import {Entity, ManyToOne, Property, Rel} from '@mikro-orm/core';
import {Cliente} from '../cliente/cliente.entity.mysql.js';
import {BaseEntity} from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Pedido extends BaseEntity {
	@Property()
	fecha!: Date;

	@Property()
	montoTotal!: number;

	@ManyToOne(() => Cliente, {nullable: false})
	cliente!: Rel<Cliente>;
}
