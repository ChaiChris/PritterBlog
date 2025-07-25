import { client as prisma } from "../prisma/client.js";
import {
  ArticleStatusFilter,
  GetPostTypes,
  GetSinglePostTypes,
} from "../types/post.type.js";

export const getPosts = async ({
  skip,
  limit,
  categoryId,
  author,
  title,
  status = ArticleStatusFilter.PUBLISHED,
}: GetPostTypes) => {
  // 定義篩選值保存變數
  const where: any = {};

  // 主題篩選
  if (categoryId !== undefined) {
    where.categoryId = categoryId;
  }

  // 作者篩選
  if (author) {
    where.user = {
      name: {
        contains: author,
        mode: "insensitive",
      },
    };
  }

  // 標題篩選
  if (title) {
    where.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  // 狀態篩選
  if (status) {
    where.status = {
      contains: status,
    };
  }

  return prisma.post.findMany({
    where,
    include: {
      user: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
    skip: skip ?? 0,
    take: limit ?? 0,
  });
};

export const getSinglePost = async ({ id }: GetSinglePostTypes) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!post) {
    throw new Error("找不到文章");
  }

  return post;
};
