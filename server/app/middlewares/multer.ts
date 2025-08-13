import * as fs from "node:fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger.js";

//用 fileURLToPath 取得當前 PATH，並支援跨平台
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 檢查目錄存在並自動創建
const checkDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    logger.info(`[ Multer Uploader ] 創建目錄: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const createUploader = (subDir: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // /server/uploads/
      const dir = path.join(__dirname, "..", "..", "uploads", subDir);
      try {
        checkDir(dir);
        fs.accessSync(dir, fs.constants.W_OK);
        cb(null, dir);
      } catch (error) {
        logger.error(`[ Multer Uploader ] 目錄設置失敗: ${dir}`, error);
        cb(error as Error, "");
      }
    },

    // 生成文件名
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomNum = Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, `${timestamp}-${randomNum}${extension}`);
    },
  });

  const uploader = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      const allowMimes = new Set([
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/avif",
      ]);

      const allowExtName = new Set([
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".avif",
      ]);

      const fileExt = path.extname(file.originalname).toLowerCase();
      if (allowMimes.has(file.mimetype) && allowExtName.has(fileExt)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `[ Multer Uploader ] 不支持的圖片格式： ${file.originalname}`
          )
        );
      }
    },
  });

  const wrappedUploader = {
    single: (fieldName: string) => {
      const middleware = uploader.single(fieldName);
      return (req: any, res: any, next: any) => {
        middleware(req, res, (error) => {
          if (error) {
            logger.error(
              `[ Multer Uploader ] 文件上傳失敗: ${fieldName}`,
              error
            );
            return next(error);
          }
          if (req.file) {
            logger.info(
              `[ Multer Uploader ] 文件上傳成功: ${req.file.filename}`
            );
          }
          next();
        });
      };
    },

    array: (fieldName: string, maxCount?: number) => {
      const middleware = uploader.array(fieldName, maxCount);
      return (req: any, res: any, next: any) => {
        middleware(req, res, (error) => {
          if (error) {
            logger.error(
              `[ Multer Uploader ] 多文件上傳失敗: ${fieldName}`,
              error
            );
            return next(error);
          }
          if (req.files?.length) {
            logger.info(`[ Multer Uploader ]  多文件上傳成功`);
          }
          next();
        });
      };
    },

    fields: (fields: multer.Field[]) => {
      const middleware = uploader.fields(fields);
      return (req: any, res: any, next: any) => {
        middleware(req, res, (error) => {
          if (error) {
            logger.error(`[ Multer Uploader ] 文件上傳失敗`, error);
            return next(error);
          }
          next();
        });
      };
    },
  };

  return wrappedUploader;
};
