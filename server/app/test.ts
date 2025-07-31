import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  const admin = await prisma.user.create({
    data: {
      email: "chris142852145@gmail.com",
      password: "$2b$10$NDi6Rc1rKzBoAw.ZY/I4rOVYvnD5qYBKiGC9SnNR0XkK2f7iJt1Yi",
      username: "root",
      role: Role.ADMIN,
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
