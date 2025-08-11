import { NextFunction, Request, Response } from "express";
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
  logger.info("optionAuthMiddleware 驗證觸發");
  const token = req.cookies?.token;

  if (!token) {
    logger.info("optionAuthMiddleware 無授權(匿名)");
    return next();
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      logger.info("optionAuthMiddleware 禁止訪問");
      return res.status(403).json({ message: "禁止訪問" });
    }
    req.user = { userId: payload.id, ...payload };
    logger.info("optionAuthMiddleware 授權成功");
    return next();
  } catch (err) {
    logger.error("optionAuthMiddleware token 驗證錯誤", err);
    return res.status(401).json({ message: "token 無效" });
  }
};
