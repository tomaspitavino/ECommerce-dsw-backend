import {
	Cascade,
	Collection,
	Entity,
	OneToMany,
	Property,
} from '@mikro-orm/core';
import { Favorito } from '../favoritos/favoritos.entity.mysql.js';
import { Pedido } from '../pedido/pedido.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Cliente extends BaseEntity {
	@Property()
	nombre!: string;

	@Property()
	apellido!: string;

	@Property({ unique: true })
	direccion!: string;

	@Property({ unique: true })
	telefono!: string;

	@Property({ unique: true })
	dni!: string;

	@Property({ unique: true })
	usuario!: string;

	@Property({ unique: true })
	email!: string;

	@Property()
	contrasenia!: string;

	@Property({ default: 'user' })
	rol!: string; // admin o user

	// @Property()
	// puntos: number = 0; // no se va a usar para el MVP

	@Property()
	fondos: number = 0;

	@OneToMany(() => Pedido, (pedidos) => pedidos.cliente, {
		cascade: [Cascade.ALL],
	})
	pedidos = new Collection<Pedido>(this);

	@OneToMany(() => Favorito, (favoritos) => favoritos.cliente, {
		cascade: [Cascade.ALL],
	})
	favoritos = new Collection<Favorito>(this);
}
