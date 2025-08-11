import { Request, Response } from "express";
import { PostAdminService } from "../services/admin.service.js";
import { logger } from "../logger.js";
import * as commentService from "../services/comment.service.js";
const postAdminService = new PostAdminService();

export const getCommentsController = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId) || postId <= 0) {
      return res.status(400).send("無效的文章 ID");
    }

    let limit = Number(req.query.limit);
    if (isNaN(limit) || limit <= 0 || limit > 100) {
      limit = 10; // 預設每頁取 10
    }

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    logger.info("[getCommentsController] ==> 開始獲取留言", {
      postId,
      limit,
      cursor,
    });

    const result = await commentService.getCommentsService(
      postId,
      limit,
      cursor
    );

    res.status(200).json(result);
  } catch (err: any) {
    if (err.message === "指標錯誤") {
      return res.status(400).json({ error: "指標錯誤" });
    }
    logger.error("[getCommentsController] 獲取失敗", {
      message: err.message,
      stack: err.stack,
      route: req.originalUrl,
      user: req.user?.id,
    });
    res.status(500).json({ error: "伺服器錯誤" });
  }
};

export const setNewCommentContentController = async (
  req: Request,
  res: Response
) => {
  try {
    logger.info("[setNewCommentContentController] ==> 開始");
    if (!req.body) {
      logger.warn("[setNewCommentContentController] 未填入資料");
      return res.status(401).json({ message: "未填入資料" });
    }
    const { body, limit } = req.body;
    const postId = req.params.id;

    if (!body || !postId) {
      logger.error("[setNewCommentContentController] 缺少欄位資料");
      return res.status(400).json({ message: "缺少留言資料" });
    }

    const userId = req.user?.userId ?? null; // 匿名留言

    const newComment = await commentService.createCommentService({
      body,
      limit,
      postId: Number(postId),
      userId: userId ? Number(userId) : undefined,
    });
    return res.status(200).json({ message: "留言成功", data: newComment });
  } catch (err) {
    logger.error("[setNewCommentContentController] 建立留言失敗:", err);
    return res.status(500).json({ message: "建立留言失敗", err });
  }
};

// export const deleteCommentController = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const postId = Number(id);
//     const commentDelete = await commentService.deleteComment({ postId });
//     res.json({
//       success: true,
//       message: "文章刪除成功",
//     });
//   } catch (err) {
//     logger.error("deletePost: 刪除文章錯誤 ", err);
//     res.status(500).json({ error: "刪除文章錯誤" });
//   }
// };
