import { MikroORM } from '@mikro-orm/core';

// de momento parece que no hace daño dejar
// toda la configuracion en el mikro-orm.config.ts de la raiz
export const orm = await MikroORM.init();

export const syncSchema = async () => {
	const generator = orm.getSchemaGenerator();
	await generator.dropSchema();
	await generator.createSchema();
	await generator.updateSchema();
};

// entities: ['dist/**/*.entity.mysql.js'],
// entitiesTs: ['src/**/*.entity.mysql.ts'],
// // dbName: 'muebleria',
// dbName: process.env.DB_NAME,
// type: 'mysql',
// // clientUrl: 'mysql://dsw:dsw@127.0.0.1:3306/muebleria',
// clientUrl: process.env.DB_URL, // Ej: mysql://user:pass@host:port/db
// highlighter: new SqlHighlighter(),
// // debug: true,
// debug: process.env.NODE_ENV !== 'production',
// schemaGenerator: {
// 	// never use in production
// 	disableForeignKeys: true,
// 	createForeignKeyConstraints: true,
// 	ignoreSchema: [],
// },

// seeder: {
// 	// defaultSeeder: 'DatabaseSeeder', // default seeder class name
// 	defaultSeeder: process.env.DEFAULT_SEEDER,
// 	path: process.env.SEEDER_PATH,
// 	pathTs: process.env.SEEDER_PATH_TS,
// 	glob: '!(*.d).{js,ts}', // how to match seeder files
// 	//  (all .js and .ts files, but not .d.ts)
// 	emit: 'ts', // seeder generation mode
// 	fileName: (className: string) => className, // seeder file naming convention
// },
