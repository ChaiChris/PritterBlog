import { Router } from "express";
import {
  getPostsController,
  getSinglePostController,
  setNewPostContentController,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createUploader } from "../middlewares/multer.js";
import {
  uploadCoverImageService,
  uploadContentImageService,
} from "../services/upload.service.js";
import { logger } from "../logger.js";

const app = Router();
const coverImageUpload = createUploader("cover-image");
const contentImageUpload = createUploader("content-image");

// GET /posts - 獲取文章列表
// 支援的查詢參數:
// - limit: 限制返回數量 (預設: 10)
// - skip: 跳過數量 (預設: 0)
// - author: 作者篩選 (可選)
// - title: 標題篩選 (可選)
// - status: 狀態篩選 (ALL, PUBLISHED, UNPUBLISHED, DELETED) (可選)
app.get("/posts", getPostsController);
app.get("/:id", getSinglePostController);
app.get("/uploads/post/test", () => {
  logger.error("/uploads/post/test 觸發");
});
app.post(
  "/uploads/post/cover",
  authMiddleware,
  coverImageUpload.single("cover"),
  uploadCoverImageService
);
app.post(
  "/uploads/post/image",
  authMiddleware,
  contentImageUpload.single("image"),
  uploadContentImageService
);
app.post("/uploads/post", authMiddleware, setNewPostContentController);

// router.delete("/", authMiddleware, deletePostController);

export default app;
