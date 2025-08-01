import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import * as bcrypt from "bcrypt";
import * as jwtService from "../utils/jwt.js";
import { client } from "../prisma/client.js";
import { z, ZodError } from "zod";
import {
  CheckUserEmail,
  CheckUserName,
  RegisterInput,
} from "../types/auth.type.js";
import { logger } from "../logger.js";
import { getProfileService } from "../services/auth.service.js";

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
  const token = await jwtService.signToken({ id: user.id });

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
  console.log("token:", token, "type:", typeof token);
  logger.info(`${email} 已成功登入並set Token: ` + token);
  res.status(200).json({ message: "登入成功" });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0, // 清除 cookie
    path: "/",
  });
  logger.info("使用者已登出，清除 token cookie");
  return res.status(200).json({ message: "登出成功" });
};

// zod 驗證 Schema
const UserRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(3).max(50),
});

export const register = async (req: Request, res: Response) => {
  logger.info("registerController 觸發:", req.body);
  try {
    const input: RegisterInput = UserRegisterSchema.parse(req.body);
    const result = await authService.registerService(input);

    //驗證資料寫入
    const user = await client.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      logger.info("registerController 資料寫入錯誤");
      return res.status(401).json({ message: "資料寫入錯誤" });
    }
    const token = result.token;
    logger.info("registerController 註冊成功：", token);

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
    console.log("token:", token, "type:", typeof token);
    res.status(200).json({ message: "登入成功" });
  } catch (e: any) {
    if (e instanceof ZodError) {
      logger.error("registerController: input type error", e);
      return res.status(400).json({ error: e });
    }

    logger.error("registerController", e);
    return res.status(400).json({
      message: "註冊失敗",
      details: e.message || null,
    });
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

export const getProfile = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "未登入" });
  }
  try {
    const result = await authService.getProfileService(token);
    return res.status(200).json(result);
  } catch (e: any) {
    logger.error("checkUserEmailController", e);
    return res.status(400).json({ message: e.message });
  }
};
