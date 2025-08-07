import { Request, Response } from "express";
import { GetCategoryPostTypes } from "../types/category.type.js";
import { logger } from "../logger.js";
import * as categoryService from "../services/category.service.js";
import z from "zod";
import { getPostCount } from "../services/post.service.js";

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    logger.error(`getCategoriesController: ERROR ${error.message}`);
    res.status(500).json({ error: "Get Categories Failed" });
  }
};

const GetCategoryPostsControllerSchema = z.object({
  id: z.coerce.number().int().positive(),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().positive().default(10),
  status: z.string().optional().default("PUBLISHED"),
});

export const getCategoryPostsController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsed = GetCategoryPostsControllerSchema.parse({
      id: req.params.id,
      skip: req.query.skip,
      limit: req.query.limit,
      status: req.query.status,
    });
    const { id: categoryId, skip, limit, status } = parsed;
    const posts = await categoryService.getCategoryPosts(
      categoryId,
      skip,
      limit,
      status
    );
    res.status(200).json(posts);
  } catch (error: any) {
    logger.error(`getCategoryPostsController: ERROR ${error.message}`);
    res.status(500).json({ error: "Get Category Posts Failed" });
  }
};
