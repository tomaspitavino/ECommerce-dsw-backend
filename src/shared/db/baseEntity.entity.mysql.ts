import {DateTimeType, PrimaryKey, Property} from '@mikro-orm/core';

export abstract class BaseEntity {
	@PrimaryKey()
	id?: number; // Usar number o string según la configuración de la base de datos

	/*
	@Property({type: DateTimeType})
	createdAt?: Date = new Date();

	@Property({type: DateTimeType, onUpdate: () => new Date()})
	updatedAt?: Date = new Date();
  */
}
