import {
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	Property,
	Rel,
} from '@mikro-orm/core';
import { Categoria } from '../categoria/categoria.entity.mysql.js';
import { Cliente } from '../cliente/cliente.entity.mysql.js';
import { lineaPedido } from '../lineaPedido/lineaPedido.entity.mysql.js';
import { Material } from '../material/material.entity.mysql.js';
import { BaseEntity } from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Mueble extends BaseEntity {
	@Property({ nullable: false })
	descripcion!: string;

	@Property({ nullable: false })
	stock!: number;

	@Property({ nullable: false })
	etiqueta!: string;

	@Property({ nullable: false })
	precioUnitario!: number;

	@Property({ nullable: true })
	imagenes?: string[]; // Array of image URLs or file paths

	@ManyToOne(() => Categoria, { nullable: true }) // pueden existir muebles sin categoria
	categoria?: Rel<Categoria> | null;

	@ManyToOne(() => Material, { nullable: true }) // pueden existir muebles sin material
	material?: Rel<Material> | null;

	@ManyToMany(() => Cliente, (cliente) => cliente.favoritos)
	favoritos = new Collection<Cliente>(this);

	// lineaPedido es una entidad que representa una relacion con atributos
	// oneToMany del lado del mueble
	@ManyToOne(() => lineaPedido, { nullable: true })
	lineaPedido?: Rel<lineaPedido>;
}
