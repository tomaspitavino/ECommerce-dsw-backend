import {
	Cascade,
	Collection,
	Entity,
	ManyToOne,
	OneToMany,
	Property,
	Rel,
} from '@mikro-orm/core';
import { Categoria } from '../categoria/categoria.entity.mysql.js';
import { Favorito } from '../favoritos/favoritos.entity.mysql.js';
import { Item } from '../item/item.entity.mysql.js';
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

	@Property({ nullable: false })
	imagenes!: string[]; // Array of image URLs or file paths

	@ManyToOne(() => Categoria, { nullable: false })
	categoria!: Rel<Categoria>;

	@ManyToOne(() => Material, { nullable: false })
	material!: Rel<Material>;

	// item es una entidad que representa una relacion con atributos
	@ManyToOne(() => Item, { nullable: true })
	item?: Rel<Item>;

	@OneToMany(() => Favorito, (favorito) => favorito.mueble, {
		cascade: [Cascade.REMOVE],
	})
	favoritos? = new Collection<Favorito>(this);
}
