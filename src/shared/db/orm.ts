import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import dotenv from 'dotenv';

dotenv.config();

export const orm = await MikroORM.init({
	entities: ['dist/**/*.entity.mysql.js'],
	entitiesTs: ['src/**/*.entity.mysql.ts'],
	// dbName: 'muebleria',
	dbName: process.env.DB_NAME,
	type: 'mysql',
	// clientUrl: 'mysql://dsw:dsw@127.0.0.1:3306/muebleria',
	clientUrl: process.env.DB_URL, // Ej: mysql://user:pass@host:port/db
	highlighter: new SqlHighlighter(),
	// debug: true,
	debug: process.env.NODE_ENV !== 'production',
	schemaGenerator: {
		// never use in production
		disableForeignKeys: true,
		createForeignKeyConstraints: true,
		ignoreSchema: [],
	},
});

export const syncSchema = async () => {
	const generator = orm.getSchemaGenerator();
	/* 
	await generator.dropSchema();
	await generator.createSchema(); 
	 */
	await generator.updateSchema();
};
