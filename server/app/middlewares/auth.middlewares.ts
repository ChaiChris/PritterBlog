import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt.js";

// authenticate middleware
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 從 Authorization 標頭中讀取 token
  const authHeader = req.headers.authorization;

  // 若是沒有找到 token 則返回錯誤
  if (!authHeader) {
    return res.status(401).json({ message: "Not authorized (缺少 Token)" });
  }

  // 取出實際 token (去除Bearer)
  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verifyToken(token);
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
