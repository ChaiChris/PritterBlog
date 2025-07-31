import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

// authenticate middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 從 Authorization 標頭中讀取 token
  const token = req.cookies.token;

  // 若是沒有找到 token 則返回錯誤
  if (!token) {
    return res.status(401).json({ message: "Not authorized (缺少 Token)" });
  }

  try {
    req.user = await verifyToken(token);
    if (!req.user) {
      return res.status(403).json({ message: "禁止訪問" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "token 無效" });
  }
};
