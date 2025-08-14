import { Request, Response, NextFunction } from "express";
import { logger } from "../logger.js";
import { client as prisma } from "../prisma/client";

export async function uploadCoverImageService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const url = `/uploads/cover-image/${req.file?.filename}`;
    logger.debug("[uploadCoverImageService] 圖片已上傳:", url);

    if (!req.file) {
      return res.status(400).json({
        message: "檔案上傳失敗",
      });
    }
    return res.status(200).json({
      message: "上傳成功",
      data: {
        url,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadContentImageService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const url = `/uploads/content-image/${req.file?.filename}`;
    logger.debug("[uploadContentImageService] 圖片已上傳:", url);

    if (!req.file) {
      return res.status(400).json({
        message: "檔案上傳失敗",
      });
    }
    return res.status(200).json({
      message: "上傳成功",
      data: {
        url,
      },
    });
  } catch (error) {
    next(error);
  }
}
