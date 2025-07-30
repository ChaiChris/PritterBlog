// import { Request, Response } from "express";
import { client } from "../prisma/client.js";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import {
  RegisterInput,
  CheckUserName,
  CheckUserEmail,
} from "../types/auth.type.js";
import { logger } from "../logger.js";

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

export const checkUserNameService = async (input: CheckUserName) => {
  if (!input.username) {
    throw new Error("缺少 username");
  }
  logger.info(`checkUserService: 觸發：${input.username}`);
  const user = await client.user.findUnique({
    where: { username: input.username },
  });
  if (user) {
    logger.info(`checkUserService: 該用戶已存在：${input.username}`);
    return { hasNameUsed: true };
  }
  logger.info(`checkUserService: 該用戶不存在：${input.username}`);
  return { hasNameUsed: false };
};

export const checkUserEmailService = async (input: CheckUserEmail) => {
  if (!input.email) {
    throw new Error("缺少 email");
  }
  const email = await client.user.findUnique({
    where: { email: input.email },
  });
  if (email) {
    logger.info(`checkUserEmailService: 該用戶已存在：${input.email}`);
    return { hasEmailUsed: true };
  }
  logger.info(`checkUserEmailService: 該用戶不存在：${input.email}`);
  return { hasEmailUsed: false };
};
