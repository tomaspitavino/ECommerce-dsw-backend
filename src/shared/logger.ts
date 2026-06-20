import { createLogger, format, transports } from "winston";

const { combine, timestamp, colorize, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    errors({ stack: true }), // loguea el stack trace en errores
    colorize(),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});
