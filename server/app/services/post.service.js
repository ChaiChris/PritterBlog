import { Prisma } from "@prisma/client";
import { client as prisma } from "../prisma/client";
import { ArticleStatusFilter } from "../types/post.type";
export const getPosts = async ({
  skip,
  limit,
  author,
  title,
  status = ArticleStatusFilter.PUBLISHED,
}) => {
  try {
    // 保存變數物件
    const where = {};
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
    return await prisma.post.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: skip ?? 0,
      take: limit ?? 0,
    });
  } catch (err) {}
};
//# sourceMappingURL=post.model.js.map
