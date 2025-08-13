import { Request, Response } from "express";
import * as postService from "../services/post.service.js";
import * as uploadService from "../services/upload.service.js";
import { PostAdminService } from "../services/admin.service.js";
import * as fs from "fs";
import * as path from "path";
import {
  GetPostTypes,
  GetSinglePostTypes,
  ArticleStatusFilter,
} from "../types/post.type.js";
import { logger } from "../logger.js";
import transPicUrlToLocalDir from "../utils/transPicUrlToLocalDir.js";

const postAdminService = new PostAdminService();

// GET /posts - 獲取文章列表
// 支援的查詢參數:
// - limit: 限制返回數量 (預設: 10)
// - skip: 跳過數量 (預設: 0)
// - author: 作者篩選 (可選)
// - title: 標題篩選 (可選)
// - status: 狀態篩選 (ALL, PUBLISHED, UNPUBLISHED, DELETED) (可選)
export const getPostsController = async (req: Request, res: Response) => {
  try {
    const { limit, skip, categoryId, author, title, status } = req.query;
    const isValidStatus = (val: any): val is ArticleStatusFilter =>
      typeof val === "string" &&
      ["ALL", "PUBLISHED", "UNPUBLISHED", "DELETED"].includes(val);

    const query: GetPostTypes = {
      limit: Number(limit) || 10,
      skip: Number(skip) || 0,
      categoryId: categoryId ? Number(categoryId) : undefined,
      author: author ? String(author) : undefined,
      title: title ? String(title) : undefined,
      status: isValidStatus(status) ? status : undefined,
    };

    const [posts, total] = await Promise.all([
      // 獲取文章
      postService.getPosts(query),
      // 獲取數量
      postService.getAllPostsCount({
        categoryId: query.categoryId,
        author: query.author,
        title: query.title,
        status: query.status,
      }),
    ]);
    console.log("[getPostsController] total:", total);
    // 分頁
    const totalPages = Math.max(
      1,
      Math.ceil(Number(total) / Number(query.limit))
    );
    console.log("[getPostsController] totalPages:", totalPages);

    const currentPage = Math.floor(
      Number(query.skip) / Number(query.limit) + 1
    );

    // 返傳包含分頁
    res.json({
      posts,
      total,
      totalPages,
      currentPage,
      limit: query.limit,
      skip: query.skip,
    });
  } catch (error) {
    logger.error("[getPostsController] 獲取文章失敗:", error);
    res.status(500).json({ error: "獲取文章失敗" });
  }
};

export const getSinglePostController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ error: "缺少id" });
  const params: GetSinglePostTypes = {
    id: Number(id),
  };

  try {
    const post = await postService.getSinglePost(params);
    logger.info("getSinglePostController: GetSinglePost Successfully");
    res.status(200).json(post);
  } catch (err: any) {
    logger.error(`getSinglePostController: ERROR ${err.message}`);
    res.status(400).json({ error: "post fetch error" });
  }
};

interface CreatePostInput {
  title: string;
  body: string;
  bodyJson: any;
  categoryId: number;
  userId: number;
  coverImagePath?: string | null;
}

export const setNewPostContentController = async (
  req: Request,
  res: Response
) => {
  try {
    logger.info("[setNewPostContentController] ==> 開始");
    const { title, body, bodyJson, categoryId, coverImagePath } = req.body;
    // console.log("bodyJson:", bodyJson);
    // console.log("body:", body);

    if (!title || !body || !bodyJson || !categoryId || !coverImagePath) {
      logger.error("[setNewPostContentController] 缺少欄位資料");
      return res.status(400).json({ message: "缺少文章資料" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      logger.error(
        "[setNewPostContentController] 缺少 userId，需檢查 auth 中介層"
      );
      return res.status(401).json({ message: "授權失敗" });
    }
    const newPost = await postService.createPostService({
      title,
      body,
      bodyJson,
      categoryId: Number(categoryId),
      userId: Number(userId),
      coverImagePath,
    });
    return res.status(200).json({ message: "文章建立成功", data: newPost });
  } catch (err) {
    logger.error("[setNewPostContentController] 建立文章失敗:", err);
    return res.status(500).json({ message: "建立文章失敗", err });
  }
};

export const setEditPostContentController = async (
  req: Request,
  res: Response
) => {
  try {
    logger.info("[setEditPostContentController] ==> 開始");
    const { id } = req.params;
    const postId = Number(id);
    logger.debug("[setEditPostContentController] postId:", postId);
    const { title, body, bodyJson, categoryId, coverImagePath } = req.body;
    logger.debug("[setEditPostContentController] bodyJson:", bodyJson);
    logger.debug("[setEditPostContentController] body:", body);

    if (!postId) {
      logger.error("[setEditPostContentController] 缺少ID");
      return res.status(400).json({ message: "缺少ID" });
    }

    if (!title || !body || !bodyJson || !categoryId || !coverImagePath) {
      logger.error("[setEditPostContentController] 缺少欄位資料");
      return res.status(400).json({ message: "缺少文章資料" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      logger.error(
        "[setEditPostContentController] 缺少 userId，需檢查 auth 中介層"
      );
      return res.status(401).json({ message: "授權失敗" });
    }

    const editedPost = await postService.editPostService(postId, {
      title,
      body,
      bodyJson,
      categoryId: Number(categoryId),
      userId: Number(userId),
      coverImagePath,
    });

    return res.status(200).json({ message: "文章修改成功", data: editedPost });
  } catch (err) {
    logger.error("[setEditPostContentController] 修改文章失敗:", err);
    return res.status(500).json({ message: "修改文章失敗", err });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    logger.info("[ deletePostController ] 觸發");
    const { id } = req.params;
    const postId = Number(id);
    const post = await postService.getSinglePost({ id: postId });
    if (!post) {
      logger.warn("deletePostController: Post is not found id ", postId);
      return res.status(404).json({ error: "Post is not found" });
    }
    await postAdminService.deletePost(postId);
    if (post.coverImagePath) {
      try {
        const localPicPath = transPicUrlToLocalDir(post.coverImagePath);
        if (localPicPath) {
          fs.unlinkSync(localPicPath);
        }
      } catch (err) {
        logger.error("deletePost: 刪除封面檔案錯誤:", err);
      }
    }

    res.json({
      success: true,
      message: "文章刪除成功",
    });
  } catch (err) {
    logger.error("deletePost: 刪除文章錯誤 ", err);
    res.status(500).json({ error: "刪除文章錯誤" });
  }
};

export async function deleteImageController(coverImageUrl: string) {
  try {
    const localPicPath = transPicUrlToLocalDir(coverImageUrl);
    if (localPicPath) {
      fs.unlinkSync(localPicPath);
    }
  } catch (error) {
    console.error("刪除錯誤:", error);
  }
}
