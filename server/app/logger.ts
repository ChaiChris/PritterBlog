import { createLogger, format, transports } from "winston";
import path from "path";

const logsDir = path.join(process.cwd(), "logs");

export const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json(), // 使用 JSON 格式更容易解析
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.printf(({ level, message, timestamp, stack }) => {
          return `${timestamp} [${level}] ${stack || message}`;
        }),
      ),
    }),
    new transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logsDir, "warning.log"),
      level: "warn", // 注意是 'warn' 不是 'warning'
    }),
    new transports.File({
      filename: path.join(logsDir, "full.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});
