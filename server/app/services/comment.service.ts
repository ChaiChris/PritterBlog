import { ArticleStatusFilter, GetPostTypes } from "../types/post.type.js";
import { client as prisma } from "../prisma/client.js";
import { decodeCursor, encodeCursor } from "../utils/cursor.js";
import {
  Comment,
  CommentResponse,
  getCommentsResponse,
  CreateCommentInput,
  CommentStatus,
} from "../types/comment.type.js";
import { logger } from "../logger.js";

export const getCommentsService = async (
  postId: number,
  limit: number,
  cursor?: string,
  authorId?: number
): Promise<getCommentsResponse> => {
  const baseWhere: any = {
    postId: postId,
    status: "PUBLISHED",
  };
  if (!postId) {
    throw new Error("缺少 postId");
  }
  let where: any = baseWhere;

  if (cursor) {
    let decoded;
    try {
      // 解碼指針
      decoded = decodeCursor(cursor);
    } catch (e) {
      return { comments: [] };
    }
    // 指針日期
    const cursorCreatedAt = new Date(decoded.createdAt);
    // 指針ID
    const cursorId = Number(decoded.id);

    where = {
      ...baseWhere,
      OR: [
        { createdAt: { lt: cursorCreatedAt } }, // 取創建時間比指針舊的
        {
          AND: [
            { createdAt: { equals: cursorCreatedAt } }, // 而且如果留言創建時間相同，則取比 ID 較小的
            { id: { lt: cursorId } },
          ],
        },
      ],
    };
  }

  const rawComments = await prisma.comment.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1, // 多取一筆
    include: {
      user: { select: { id: true, username: true, avatarPath: true } },
    },
  });

  let nextCursor: string | null = null;

  // 每次多取一筆，如果留言長度大於限制（原本要取的）長度，則代表還有下一頁
  if (rawComments.length > limit) {
    const nextItem = rawComments.pop()!; // 移除多的一筆並取出
    nextCursor = encodeCursor(nextItem.createdAt, nextItem.id); // 設成指針並轉成易於傳輸的base64代碼
  }

  const comments: Comment[] = rawComments.map((c) => ({
    id: c.id,
    userId: c.userId,
    postId: c.postId,
    body: c.body,
    status: c.status as CommentStatus,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    user: c.user
      ? {
          id: c.user.id,
          username: c.user.username,
          avatarPath: c.user.avatarPath,
        }
      : null,
    isAuthor: authorId ? c.userId === authorId : false,
  }));

  return {
    comments,
    nextCursor,
  };
};

export async function createCommentService(input: CreateCommentInput) {
  if (!input.postId || !input.body.trim()) {
    throw new Error("缺少必要的欄位資料（postId 或 body）");
  }

  const data: any = {
    body: input.body,
    postId: input.postId,
    status: "PUBLISHED",
  };

  if (input.userId !== null) {
    data.userId = input.userId;
  }

  const newComment = await prisma.comment.create({ data });
  return newComment;
}

export async function deleteCommentService(postId: number) {
  return await prisma.comment.delete({
    where: { id: postId },
  });
}

export async function getSingleCommentService(commentId: number) {
  try {
    return await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
        body: true,
        postId: true,
        createdAt: true,
      },
    });
  } catch (err) {
    logger.error("[commentService.getCommentById] 查詢失敗", err);
    throw new Error("查詢留言失敗");
  }
}
