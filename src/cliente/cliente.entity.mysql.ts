import {
	Cascade,
	Collection,
	Entity,
	ManyToMany,
	OneToMany,
	Property,
} from '@mikro-orm/core';
import { Mueble } from '../mueble/mueble.entity.mysql.js';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Cliente extends BaseEntity {
	@Property({ nullable: false })
	nombre!: string;

	@Property({ nullable: false })
	apellido!: string;

	@Property({ nullable: false, unique: true })
	direccion!: string;

	@Property({ nullable: false, unique: true })
	telefono!: string;

	@Property({ nullable: false, unique: true })
	dni!: string;

	@Property({ nullable: false, unique: true })
	usuario!: string;

	@Property({ nullable: false, unique: true })
	email!: string;

	@Property({ nullable: false })
	contrasenia!: string;

	@Property()
	puntos: number = 0;

	@Property()
	fondos: number = 0;

	@OneToMany(() => Pedido, (pedidos) => pedidos.cliente, {
		cascade: [Cascade.ALL],
	})
	pedidos = new Collection<Pedido>(this);

	@ManyToMany(() => Mueble, (mueble) => mueble.favoritos, { owner: true })
	favoritos = new Collection<Mueble>(this);
}
