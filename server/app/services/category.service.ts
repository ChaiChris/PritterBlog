import { client as prisma } from "../prisma/client.js";
import { ArticleStatus } from "@prisma/client";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
};

export const getCategoryPosts = async (
  categoryId: number,
  skip: number,
  limit: number,
  status: string
) => {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        categoryId,
        status: status as ArticleStatus,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({
      where: {
        categoryId,
        status: status as ArticleStatus,
      },
    }),
  ]);
  return {
    posts,
    total,
  };
};
