import { client as prisma } from "../prisma/client";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
};
