import { createLogger, format, transports } from "winston";
export const logger = createLogger({
    level: "debug",
    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.errors({ stack: true }), format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level}] ${stack || message}`;
    })),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/warning.log", level: "warning" }),
        new transports.File({ filename: "logs/full.log" }),
    ],
});
//# sourceMappingURL=logger.js.map