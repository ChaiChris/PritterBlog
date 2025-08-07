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
      equals: status,
    };
  }

  return prisma.post.findMany({
    where,
    include: {
      user: true,
      category: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: skip ?? 0,
    take: limit ?? 10,
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

interface CreatePostInput {
  title: string;
  body: string;
  categoryId: number;
  userId: number;
  coverImagePath?: string | null;
}

export async function createPostService(input: CreatePostInput) {
  const { title, body, categoryId, userId, coverImagePath } = input;

  const newPost = await prisma.post.create({
    data: {
      title,
      body,
      categoryId,
      userId,
      coverImagePath: coverImagePath || null,
    },
  });

  return newPost;
}
interface GetPostsCountParams {
  categoryId?: number;
  status?: string;
  author?: string;
  title?: string;
}

export const getAllPostsCount = async (params: GetPostsCountParams = {}) => {
  const { categoryId, status = "PUBLISHED", author, title } = params;
  const conditions: any = {};
  if (categoryId !== undefined) conditions.categoryId = categoryId;
  if (status && status !== "ALL") conditions.status = status;
  if (author) {
    conditions.author = {
      contains: author,
      mode: "insensitive",
    };
  }
  if (title) {
    conditions.title = {
      contains: title,
      mode: "insensitive",
    };
  }
  const total = await prisma.post.count({
    where: conditions,
  });

  return total;
};

export async function getPostCount(conditions: {}) {
  return prisma.post.count({
    where: conditions,
  });
}
