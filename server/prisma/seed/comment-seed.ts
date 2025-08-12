import { PrismaClient, Prisma, ArticleStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
//  v
const prisma = new PrismaClient();

async function main() {
  const comments: Prisma.CommentCreateManyInput[] = [];

  const users = await prisma.user.findMany({ select: { id: true } });
  const posts = await prisma.post.findMany({ select: { id: true } });

  if (users.length === 0 || posts.length === 0) {
    console.log("請先確認 user 與 post 表裡有資料");
    return;
  }

  for (let i = 0; i < 100; i++) {
    comments.push({
      userId: faker.helpers.arrayElement(users).id,
      postId: faker.helpers.arrayElement(posts).id,
      body: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      status: ArticleStatus.PUBLISHED,
    });
  }

  await prisma.comment.createMany({
    data: comments,
    skipDuplicates: true,
  });

  console.log("留言 Seed 完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
