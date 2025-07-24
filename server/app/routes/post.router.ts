import { Router } from "express";
import {
  getPostsController,
  getSinglePostController,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

// GET /posts - 獲取文章列表
// 支援的查詢參數:
// - limit: 限制返回數量 (預設: 10)
// - skip: 跳過數量 (預設: 0)
// - author: 作者篩選 (可選)
// - title: 標題篩選 (可選)
// - status: 狀態篩選 (ALL, PUBLISHED, UNPUBLISHED, DELETED) (可選)

router.get("/", getPostsController);
router.get("/:id", getSinglePostController);
// router.post("/", authMiddleware, setNewPostController);
// router.delete("/", authMiddleware, deletePostController);

export default router;
