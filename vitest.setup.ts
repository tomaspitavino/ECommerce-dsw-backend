import "dotenv/config";

process.env.JWT_SECRET ??= "test-jwt-secret";
process.env.JWT_REFRESH_SECRET ??= "test-jwt-refresh-secret";
process.env.DB_URL ??= "mysql://dsw:dsw@127.0.0.1:3320/muebleria";
process.env.DB_NAME ??= "muebleria";
