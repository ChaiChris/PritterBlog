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

export const getCommentsService = async (
  postId: number,
  limit: number,
  cursor?: string
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
      decoded = decodeCursor(cursor);
    } catch (e) {
      return { comments: [] };
    }
    const cursorCreatedAt = new Date(decoded.createdAt);
    const cursorId = Number(decoded.id);

    where = {
      ...baseWhere,
      OR: [
        { createdAt: { lt: cursorCreatedAt } }, // lt -> 小於
        {
          AND: [
            { createdAt: { equals: cursorCreatedAt } },
            { id: { lt: cursorId } },
          ],
        },
      ],
    };
  }

  const rawComments = await prisma.comment.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
    include: {
      user: { select: { id: true, username: true, avatarPath: true } },
    },
  });

  let nextCursor: string | null = null;

  if (rawComments.length > limit) {
    const nextItem = rawComments.pop()!;
    nextCursor = encodeCursor(nextItem.createdAt, nextItem.id);
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
