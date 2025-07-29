import { client as prisma } from "../prisma/client.js";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
};
