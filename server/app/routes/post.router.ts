import { Router } from "express";
import {
  getPostsController,
  getSinglePostController,
  setNewPostContentController,
  setEditPostContentController,
  deleteImageController,
  deletePostController,
} from "../controllers/post.controller.js";
import {
  authMiddleware,
  optionAuthMiddleware,
} from "../middlewares/auth.middlewares.js";
import { createUploader } from "../middlewares/multer.js";
import {
  uploadCoverImageService,
  uploadContentImageService,
} from "../services/upload.service.js";
import {
  getCommentsController,
  setNewCommentContentController,
  deleteCommentController,
} from "../controllers/comment.controller.js";

const app = Router();
const coverImageUpload = createUploader("cover-image");
const contentImageUpload = createUploader("content-image");

//---- 文章處理
app.get("/posts", getPostsController);
app.get("/post/:id", getSinglePostController);
app.post("/post", authMiddleware, setNewPostContentController);
app.put("/post/:id", authMiddleware, setEditPostContentController);
app.delete("/post/:id", authMiddleware, deletePostController);

//---- 上傳
app.post(
  "/uploads/post/cover",
  authMiddleware,
  //圖片上傳中介層
  coverImageUpload.single("cover"),
  uploadCoverImageService
);

app.delete("/uploads/post/image", authMiddleware, deleteImageController);

app.post(
  "/uploads/post/image",
  authMiddleware,
  contentImageUpload.single("image"),
  uploadContentImageService
);

// app.delete("/uploads/post/cover", authMiddleware, deleteCoverImageController);

//---- 留言
app.get("/post/:id/comments", optionAuthMiddleware, getCommentsController);

app.post(
  "/uploads/comment/:id",
  optionAuthMiddleware,
  setNewCommentContentController
);

app.delete("/comment/:id", authMiddleware, deleteCommentController);

export default app;
