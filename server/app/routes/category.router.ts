import { Router } from "express";
import { getCategoriesController } from "../controllers/category.controller.js";
const app = Router();

// 取得所有主題
app.get("/all", getCategoriesController);
// router.get("/:id", getCategoryPostsController);

export default app;
