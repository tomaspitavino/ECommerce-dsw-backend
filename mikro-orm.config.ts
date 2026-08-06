import { defineConfig } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entities: ["dist/**/*.entity.mysql.js"],
  entitiesTs: ["src/**/*.entity.mysql.ts"],

  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
  },

  dbName: process.env.DB_NAME,
  type: "mysql",
  clientUrl: process.env.DB_URL, // Ej: mysql://user:pass@host:port/db
  highlighter: new SqlHighlighter(),
  debug: !isProduction,
  schemaGenerator: {
    disableForeignKeys: !isProduction, // solo activa en produccion
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },

  seeder: {
    defaultSeeder: process.env.DEFAULT_SEEDER,
    path: process.env.SEEDER_PATH,
    pathTs: process.env.SEEDER_PATH_TS,
  },
});
