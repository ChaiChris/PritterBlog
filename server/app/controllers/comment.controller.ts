import { Request, Response } from "express";
import { PostAdminService } from "../services/admin.service.js";
import { logger } from "../logger.js";
import * as commentService from "../services/comment.service.js";
const postAdminService = new PostAdminService();

export const getCommentsController = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user?.userId);
    if (isNaN(postId) || postId <= 0) {
      return res.status(400).send("無效的文章 ID");
    }

    let limit = Number(req.query.limit);
    if (isNaN(limit) || limit <= 0 || limit > 100) {
      limit = 10; // 預設每頁取 10
    }

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    logger.debug("[getCommentsController] 獲取留言");

    const result = await commentService.getCommentsService(
      postId,
      limit,
      cursor,
      userId
    );

    res.status(200).json(result);
  } catch (err: any) {
    if (err.message === "指標錯誤") {
      logger.error("[getCommentsController] 指標錯誤");
      return res.status(400).json({ error: "指標錯誤" });
    }
    logger.error("[getCommentsController] 獲取失敗");
    res.status(500).json({ error: "伺服器錯誤" });
  }
};

export const setNewCommentContentController = async (
  req: Request,
  res: Response
) => {
  try {
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

export const deleteCommentController = async (req: Request, res: Response) => {
  try {
    logger.debug("[deleteCommentController] 觸發");
    const commentId = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      logger.warn("[deleteCommentController] 未授權");
      return res.status(401).json({ error: "未授權" });
    }
    if (isNaN(commentId) || commentId <= 0) {
      logger.warn("[deleteCommentController] 無效的留言ID");
      return res.status(400).json({ error: "無效的留言ID" });
    }
    // 驗證留言者，僅留言人及管理員可以刪除留言
    const comment = await commentService.getSingleCommentService(commentId);
    if (!comment) {
      logger.warn("[deleteCommentController] 留言不存在");
      return res.status(404).json({ error: "留言不存在" });
    }
    if (userRole !== "ADMIN") {
      if (comment.userId !== userId) {
        logger.error("[deleteCommentController] 非法觸發");
        return res.status(403).json({ error: "非法觸發" });
      }
    }
    await commentService.deleteCommentService(commentId);
    res.status(200).json({
      success: true,
      message: "留言刪除成功",
    });
  } catch (err) {
    logger.error("[ deleteCommentController ]: 留言刪除失敗 ", err);
    res.status(500).json({ error: "留言刪除失敗" });
  }
};
