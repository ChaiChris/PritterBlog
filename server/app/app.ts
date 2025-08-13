import express, { Request, Response, NextFunction } from "express";
import { logger } from "./logger.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cookieParser());
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked!`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // 允許 cookie 傳遞
  })
);
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// 記錄所有連線請求
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url}`
  );
  next();
});

app.get("/test", (req, res) => {
  try {
    res.json({
      message: "測試路由回應成功 v2",
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

app.get("/debug-cookie", (req, res) => {
  // console.log("All cookies:", req.cookies);
  // console.log("cookie header:", req.headers.cookie);
  res.json({
    cookies: req.cookies,
    rawCookie: req.headers.cookie,
    tokenExists: !!req.cookies?.token,
  });
});

app.post("/clear-cookie", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Cookie 已清理" });
});

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

  console.error("Error middleware triggered:", errorLog);
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
