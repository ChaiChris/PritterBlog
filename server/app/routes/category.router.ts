import { Router } from "express";
import { getCategoriesController } from "../controllers/category.controller.js";
const router = Router();

router.get("/all", getCategoriesController);
// router.get("/:id", getCategoryPostsController);

export default router;
