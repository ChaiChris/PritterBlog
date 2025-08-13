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
  const token = await jwtService.signToken({ id: user.id, role: user.role });

  //把 token 存在 cookie 裡
  res.cookie("token", token, {
    // httpOnly 將無法被 JavaScript 讀取
    httpOnly: true,
    // 可在 HTTP 傳輸
    secure: false,
    // 防止跨站
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  // logger.info(`${email} 已成功登入`);
  res.status(200).json({ message: "登入成功" });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0, // 清除 cookie
    path: "/",
  });
  logger.info("[ logoutController ] 使用者已登出");
  return res.status(200).json({ message: "登出成功" });
};

// zod 驗證 Schema
const UserRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(3).max(50),
});

export const register = async (req: Request, res: Response) => {
  logger.info("[ registerController ] 觸發:", req.body);
  try {
    const input: RegisterInput = UserRegisterSchema.parse(req.body);
    const result = await authService.registerService(input);

    //額外驗證資料是否寫入
    // const user = await client.user.findUnique({
    //   where: { email: input.email },
    // });

    // if (!user) {
    //   logger.info("registerController 資料寫入錯誤");
    //   return res.status(401).json({ message: "資料寫入錯誤" });
    // }
    console.log("[ register ] result: ", result);
    const token = result.token;
    logger.info("[ registerController ] 註冊成功");

    //把 token 存在 cookie 裡
    res.cookie("token", token, {
      // httpOnly 將無法被 JavaScript 讀取
      httpOnly: true,
      secure: false,
      // 防止跨站請求
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({ message: "登入成功" });
  } catch (e: any) {
    if (e instanceof ZodError) {
      logger.error("[ registerController ] input type error", e);
      return res.status(400).json({ error: e });
    }

    logger.error("registerController", e);
    return res.status(400).json({
      message: "註冊失敗",
      details: e.message || null,
    });
  }
};

// export const checkUserName = async (req: Request, res: Response) => {
//   const userNameInput: CheckUserName = req.body;
//   try {
//     const result = await authService.checkUserNameService(userNameInput);
//     return res.status(201).json(result);
//   } catch (e: any) {
//     logger.error("checkUserNameController", e);
//     return res.status(400).json({ message: e.message });
//   }
// };

// export const checkUserEmail = async (req: Request, res: Response) => {
//   const userEmailInput: CheckUserEmail = req.body;
//   try {
//     const result = await authService.checkUserEmailService(userEmailInput);
//     return res.status(201).json(result);
//   } catch (e: any) {
//     logger.error("checkUserEmailController", e);
//     return res.status(400).json({ message: e.message });
//   }
// };

export const getProfile = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "未登入" });
  }
  try {
    const result = await authService.getProfileService(token);
    return res.status(200).json(result);
  } catch (e: any) {
    logger.error("[ checkUserEmailController ] ", e);
    return res.status(400).json({ message: e.message });
  }
};

export const verifyAdminController = async (req: Request, res: Response) => {
  const token = req.cookies?.token;
  if (!token) {
    logger.warn("[ verifyAdminController ] 未登入");
    return res.status(401).json({
      success: false,
      message: "未登入",
    });
  }

  try {
    if (!req.user) {
      logger.error("[ verifyAdminController ] 中介授權失敗");
      return res.status(401).json({
        success: false,
        message: "中介授權失敗",
      });
    }

    const { userId, role } = req.user;
    if (!userId) {
      logger.error(
        "[ verifyAdminController ] 缺少 userId，需檢查 auth 中介層或使用者資料異常"
      );
      return res.status(401).json({
        success: false,
        message: "授權失敗",
      });
    }

    if (!role) {
      logger.error(`[ verifyAdminController ] 使用者資料異常}`);
      return res.status(401).json({
        success: false,
        message: "使用者資料異常",
      });
    }

    if (role !== "ADMIN") {
      logger.warn(`[ verifyAdminController ] 沒有權限`);
      return res.status(403).json({
        success: false,
        message: "沒有權限",
      });
    }
    return res.status(200).json({
      success: true,
      message: "管理員權限驗證成功",
      data: {
        userId,
      },
    });
  } catch (e: any) {
    logger.error("[ checkUserEmailController ] ", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
