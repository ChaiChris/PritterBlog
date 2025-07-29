import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { client } from "../prisma/client.js";
import { z } from "zod";
import {
  CheckUserEmail,
  CheckUserName,
  RegisterInput,
} from "../types/auth.type.js";
import { checkUserNameService } from "../services/auth.service.js";
import { logger } from "../logger.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await client.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "找不到該使用者" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    logger.warn(`login: ${email} 登入驗證失敗`);
    return res.status(401).json({ message: "登入驗證失敗" });
  }

  const token = signToken({ id: user.id });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  logger.info(`${email} 已成功登入並set Token: ` + token);
  res.status(200).json({ message: "登入成功" });
};

const UserRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(3).max(50),
});

export const register = async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = UserRegisterSchema.parse(req.body);
    const result = await authService.registerService(input);
    return res.status(201).json(result);
  } catch (e: any) {
    logger.error("registerController", e);
    return res.status(400).json({ message: e.message });
  }
};

export const checkUserName = async (req: Request, res: Response) => {
  const userNameInput: CheckUserName = req.body;
  try {
    const result = await authService.checkUserNameService(userNameInput);
    return res.status(201).json(result);
  } catch (e: any) {
    logger.error("checkUserNameController", e);
    return res.status(400).json({ message: e.message });
  }
};

export const checkUserEmail = async (req: Request, res: Response) => {
  const userEmailInput: CheckUserEmail = req.body;
  try {
    const result = await authService.checkUserEmailService(userEmailInput);
    return res.status(201).json(result);
  } catch (e: any) {
    logger.error("checkUserEmailController", e);
    return res.status(400).json({ message: e.message });
  }
};
