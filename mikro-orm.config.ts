import { defineConfig } from "@mikro-orm/mysql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  entities: ["dist/**/*.entity.mysql.js"],
  entitiesTs: ["src/**/*.entity.mysql.ts"],
  dbName: process.env.DB_NAME,
  type: "mysql",
  clientUrl: process.env.DB_URL, // Ej: mysql://user:pass@host:port/db
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== "production",
  schemaGenerator: {
    // never use in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },

  seeder: {
    defaultSeeder: process.env.DEFAULT_SEEDER,
    path: process.env.SEEDER_PATH,
    pathTs: process.env.SEEDER_PATH_TS,
  },
});
