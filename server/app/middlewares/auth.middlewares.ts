import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { logger } from "../logger.js";

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

// 不予許未登入狀態
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug("[ authMiddleware ] 開始驗證");
  const token = req.cookies?.token;

  if (!token) {
    logger.warn("[ authMiddleware ] 無授權");
    return res.status(401).json({ message: "Not authorized (缺少 Token)" });
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      logger.warn("[ authMiddleware ] 禁止訪問");
      return res.status(403).json({ message: "禁止訪問" });
    }
    req.user = { userId: payload.id, ...payload };
    res.locals.token = token;
    logger.debug("[ authMiddleware ] 授權成功");
    next();
  } catch (err) {
    logger.error("[ authMiddleware ] token 驗證錯誤", err);
    return res.status(401).json({ message: "token 無效" });
  }
};

// 予許未登入狀態
export const optionAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug("[ optionAuthMiddleware ] 開始驗證");
  const token = req.cookies?.token;

  if (!token) {
    logger.debug("[ optionAuthMiddleware ] 未登入通過");
    return next();
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      logger.warn("optionAuthMiddleware token異常");
      return res.status(403).json({ message: "禁止訪問" });
    }
    req.user = { userId: payload.id, ...payload };
    return next();
  } catch (err) {
    logger.error("optionAuthMiddleware token 驗證錯誤", err);
    return res.status(401).json({ message: "token 無效" });
  }
};
