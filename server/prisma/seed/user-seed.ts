import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

type UserSeed = {
  email: string;
  password: string;
  avatarPath: string;
  username: string;
  role: Role;
};

async function main() {
  const users: UserSeed[] = [];
  const passwordTest = "123456";
  for (let i = 0; i < 100; i++) {
    users.push({
      email: faker.internet.email(),
      password: await bcrypt.hash(passwordTest, 10),
      avatarPath: faker.image.avatarGitHub(),
      username: faker.internet.username(),
      role: Role.USER,
    });
  }
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // 避免重複插入
  });
  console.log("Seed 完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
