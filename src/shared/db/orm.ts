import {MikroORM} from '@mikro-orm/core';
import {SqlHighlighter} from '@mikro-orm/sql-highlighter';

export const orm = await MikroORM.init({
	entities: ['dist/**/*.entity.js'],
	entitiesTs: ['src/**/*.entity.ts'],
	dbName: 'muebleria',
	type: 'mysql',
	clientUrl: 'mysql://utanedsw:scrumtanu@127.0.0.1:3306/muebleria',
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
