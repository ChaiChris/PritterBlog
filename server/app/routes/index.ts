import { Router } from "express";
import postRouter from "./post.router.js";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";

const app = Router();
app.use((req, res, next) => {
  console.log(`[全域LOG] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/blog", postRouter);
app.use("/auth", authRouter);
app.use("/category", categoryRouter);

export default app;
