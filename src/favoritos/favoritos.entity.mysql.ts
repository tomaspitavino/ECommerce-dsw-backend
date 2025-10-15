import { Entity, ManyToOne, Rel } from '@mikro-orm/core';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { Mueble } from '../mueble/mueble.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Favorito extends BaseEntity {
	@ManyToOne(() => Cliente)
	cliente!: Rel<Cliente>;

	@ManyToOne(() => Mueble)
	mueble!: Rel<Mueble>;
}
