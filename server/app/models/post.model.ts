import { client as prisma } from "../prisma/client.js";
import {
  GetPostTypes,
  GetSinglePostTypes,
  ArticleStatusFilter,
} from "../types/post.type.js";
import { error } from "winston";

export const getPosts = async ({
  skip,
  limit,
  author,
  title,
  status = ArticleStatusFilter.PUBLISHED,
}: GetPostTypes) => {
  try {
    // 定義篩選值保存變數
    const where: any = {};

    // 作者篩選
    if (author) {
      where.user = {
        name: {
          contains: author,
          mode: "inactive",
        },
      };
    }

    // 標題篩選
    if (title) {
      where.title = {
        contains: title,
        mode: "inactive",
      };
    }

    // 狀態篩選
    if (status) {
      where.status = {
        contains: status,
      };
    }

    return await prisma.post.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: skip ?? 0,
      take: limit ?? 0,
    });
  } catch (err) {
    throw new Error("取得文章失敗");
  }
};

export const getSinglePost = async ({ id }: GetSinglePostTypes) => {
  try {
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
  } catch (err) {
    throw new Error("取得文章失敗");
  }
};
