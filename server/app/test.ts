import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  const admin = await prisma.user.create({
    data: {
      email: "chris142852145@outlook.com",
      password: "142852145", // 注意：密碼應該先 hash，不要存明文
      username: "root",
      role: Role.ADMIN, // 指定角色為管理員
    },
  });
  console.log("Created admin user:", admin);
}

createAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
