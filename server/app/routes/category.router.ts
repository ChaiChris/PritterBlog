import { Router } from "express";
import { getCategoriesController } from "../controllers/category.controller.js";
const app = Router();

app.get("/all", getCategoriesController);
// router.get("/:id", getCategoryPostsController);

export default app;
