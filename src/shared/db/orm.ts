import { MikroORM } from "@mikro-orm/core";

export const orm = await MikroORM.init();

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();
};

export const updateSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};
