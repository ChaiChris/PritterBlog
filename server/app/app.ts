import express, { Request, Response, NextFunction } from "express";
import { logger } from "./logger.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// 記錄所有連線請求
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url}`,
  );
  next();
});

// 錯誤測試代碼
app.get("/error", (req, res) => {
  throw new Error("ERROR TEST: Something went wrong");
});

// 掛載路由
app.use("/api", routes);

// 紀錄錯誤
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(statusCode).json({
    error: "Server Error",
    message: process.env.NODE_ENV === "dev" ? err.message : undefined,
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info("Server running on http://localhost:3001 (DockerProject)");
});
