import { Request, Response } from "express";
import { GetCategoryPostTypes } from "../types/category.type";
import { logger } from "../logger";
import * as categoryService from "../services/category.service";

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    logger.error(`getCategoriesController: ERROR ${error.message}`);
    res.status(500).json({ error: "Get Categories Failed" });
  }
};
