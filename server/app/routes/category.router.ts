import { Router } from "express";
import { getCategoriesController } from "../controllers/category.controller";
const router = Router();

router.get("/all", getCategoriesController);

export default router;
