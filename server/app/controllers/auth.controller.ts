import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { client } from "../prisma/client.js";
import { z, ZodError } from "zod";
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

  // 比對密碼
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    //如果密碼錯誤，回傳 401
    logger.warn(`login: ${email} 登入驗證密碼失敗`);
    return res.status(401).json({ message: "登入驗證失敗" });
  }

  //產生 JWT
  const token = signToken({ id: user.id });

  //把 token 存在 cookie 裡
  res.cookie("token", token, {
    // httpOnly 將無法被 JavaScript 讀取
    httpOnly: true,
    // 僅在 HTTPS 傳輸
    secure: false,
    // 防止跨站請求偽造
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  logger.info(`${email} 已成功登入並set Token: ` + token);
  res.status(200).json({ message: "登入成功" });
};

// zod 驗證 Schema
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
    if (e instanceof ZodError) {
      logger.error("registerController: input type error", e);
      res.status(400).json({ error: e.message });
    } else {
      logger.error("registerController", e);
    }
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
