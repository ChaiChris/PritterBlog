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
    origin: "http://localhost:3000", // 前端網址
    credentials: true, // 允許 cookie 傳遞
  }),
);

// 記錄所有連線請求
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url}`,
  );
  next();
});

app.get("/test", (req, res) => {
  try {
    res.json({
      message: "測試路由回應成功",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error("Test route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 錯誤測試代碼
app.get("/error", (req, res) => {
  throw Error("ERROR TEST: Something went wrong");
});

// 掛載路由
app.use("/api", routes);

// 紀錄錯誤
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  const errorLog = {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    statusCode,
  };

  // 同時輸出到 console 確認有執行到
  console.error("Error middleware triggered:", errorLog);

  // 使用 logger.error 記錄
  logger.error("Request error", errorLog);

  res.status(statusCode).json({
    error: "Server Error",
    message: err.message,
  });
});

const port = Number(process.env.PORT) || 8080;

app.listen(port, "0.0.0.0", () => {
  logger.info(`Server running on http://localhost:${port} (DockerProject)`);
});
