import {MikroORM} from '@mikro-orm/core';
import {SqlHighlighter} from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
	entities: ['dist/**/*.entity.mysql.js'],
	entitiesTs: ['src/**/*.entity.mysql.ts'],
	dbName: 'muebleria',
	type: 'mysql',
	clientUrl: 'mysql://dsw:dsw@127.0.0.1:3306/muebleria',
	highlighter: new SqlHighlighter(),
	debug: true,
	schemaGenerator: {
		// never use in production
		disableForeignKeys: true,
		createForeignKeyConstraints: true,
		ignoreSchema: [],
	},
});

export const syncSchema = async () => {
	const generator = orm.getSchemaGenerator();
	await generator.updateSchema();
};
