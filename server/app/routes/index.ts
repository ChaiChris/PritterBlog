import { Router } from "express";
import postRouter from "./post.router.js";
import authRouter from "./auth.router.js";
import categoryRouter from "./category.router.js";

const router = Router();

router.use("/post", postRouter);
router.use("/auth", authRouter);
router.use("/category", categoryRouter);

export default router;
