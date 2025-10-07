import {Entity, ManyToOne, Property, Rel} from '@mikro-orm/core';
import {Categoria} from '../categoria/categoria.entity.mysql.js';
import {lineaPedido} from '../lineaPedido/lineaPedido.entity.mysql.js';
import {Material} from '../material/material.entity.mysql.js';
import {BaseEntity} from '../shared/db/baseEntity.entity.mysql.js';

@Entity()
export class Mueble extends BaseEntity {
	@Property({nullable: false})
	descripcion!: string;

	@Property({nullable: false})
	stock!: number;

	@Property({nullable: false})
	etiqueta!: string;

	@Property({nullable: false})
	precioUnitario!: number;

	@ManyToOne(() => Categoria, {nullable: false})
	categoria!: Rel<Categoria>;

	@ManyToOne(() => Material, {nullable: false})
	material!: Rel<Material>;

	// lineaPedido es una entidad que representa una relacion con atributos
	// oneToMany del lado del mueble
	@ManyToOne(() => lineaPedido, {nullable: true})
	lineaPedido?: Rel<lineaPedido>;

	/* @Property({nullable: true})
      imagenes?: string[]; // Array of image URLs or file paths */
}
