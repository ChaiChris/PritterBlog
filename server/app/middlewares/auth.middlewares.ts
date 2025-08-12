import { NextFunction, Request, Response } from "express";

declare module "express" {
  interface Request {
    user?: {
      [key: string]: any;
      userId: number;
      role?: "ADMIN" | "USER" | undefined | string;
      email?: string | undefined;
    };
  }
}

import { verifyToken } from "../utils/jwt.js";
import { logger } from "../logger.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("authMiddleware 驗證觸發");
  const token = req.cookies?.token;

  if (!token) {
    logger.info("authMiddleware 無授權");
    return res.status(401).json({ message: "Not authorized (缺少 Token)" });
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      logger.info("authMiddleware 禁止訪問");
      return res.status(403).json({ message: "禁止訪問" });
    }
    req.user = { userId: payload.id, ...payload };
    logger.info("authMiddleware 授權成功");
    next();
  } catch (err) {
    logger.error("authMiddleware token 驗證錯誤", err);
    return res.status(401).json({ message: "token 無效" });
  }
};

export const optionAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("[ optionAuthMiddleware ] 開始驗證");
  const token = req.cookies?.token;

  if (!token) {
    logger.info("[ optionAuthMiddleware ] 未登入通過");
    return next();
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      logger.info("optionAuthMiddleware token異常");
      return res.status(403).json({ message: "禁止訪問" });
    }
    req.user = { userId: payload.id, ...payload };
    // console.log("optionAuthMiddleware 登入通過");
    // console.log("optionAuthMiddleware payload:", payload);
    // console.log("optionAuthMiddleware user:", req.user);
    return next();
  } catch (err) {
    logger.error("optionAuthMiddleware token 驗證錯誤", err);
    return res.status(401).json({ message: "token 無效" });
  }
};
