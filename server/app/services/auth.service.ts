// import { Request, Response } from "express";
import { client } from "../prisma/client";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { RegisterInput, CheckUserName } from "../types/auth.type";
import { logger } from "../logger";

export const registerService = async (input: RegisterInput) => {
  const existingEmail = await client.user.findUnique({
    where: { email: input.email },
  });
  if (existingEmail) {
    logger.warn(`registerService：ERROR email 已存在 - ${input.email}`);
    throw new Error("Email 已被註冊");
  }

  const existingUsername = await client.user.findUnique({
    where: { username: input.username },
  });
  if (existingUsername) {
    logger.warn(`registerService：ERROR username 已存在 - ${input.username}`);
    throw new Error("使用者名稱已被註冊");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const newUser = await client.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      username: input.username,
    },
  });
  logger.info(`registerService: 成功註冊：${newUser.email}`);
  const token = signToken({ id: newUser.id });
  logger.info(`registerService: signToken success：${newUser.email}`);
  return { token };
};

export const checkUserService = async (input: CheckUserName) => {
  const user = await client.user.findUnique({
    where: { username: input.username },
  });
  if (user) {
    logger.info(`checkUserService: 該用戶已存在：${input.username}`);
    return { hasNameUsed: true };
  }
  return { hasNameUsed: false };
};
