import * as fs from "node:fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkDir = (dir: string) => {
  logger.info(`正在檢查目錄: ${dir}`);

  if (!fs.existsSync(dir)) {
    logger.info(`目錄不存在，正在創建: ${dir}`);
    try {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`目錄創建成功: ${dir}`);
    } catch (error) {
      logger.error(`目錄創建失敗: ${dir}`, error);
      throw error;
    }
  } else {
    logger.info(`目錄已存在: ${dir}`);
  }
};

export const createUploader = (subDir: string) => {
  logger.info(`開始創建上傳器 - 子目錄: ${subDir}`);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      logger.info(
        `處理文件目標路徑 - 原始文件名: ${file.originalname}, MIME 類型: ${file.mimetype}`
      );

      const dir = path.join(__dirname, "..", "..", "uploads", subDir);
      logger.info(`計算的完整目錄路徑: ${dir}`);

      try {
        checkDir(dir);
        logger.info(`目標目錄驗證成功，準備調用回調: ${dir}`);

        // 檢查目錄權限
        try {
          fs.accessSync(dir, fs.constants.W_OK);
          logger.info(`目錄寫入權限檢查通過: ${dir}`);
        } catch (permError) {
          logger.error(`目錄權限檢查失敗: ${dir}`, permError);
        }

        logger.info(`正在調用 destination 回調函數`);
        cb(null, dir);
        logger.info(`destination 回調函數調用完成`);
      } catch (error) {
        logger.error(`目標目錄設置失敗: ${dir}`, error);
        cb(error as Error, "");
      }
    },

    filename: (req, file, cb) => {
      logger.info(`開始生成文件名 - 原始文件名: ${file.originalname}`);
      logger.info(`文件詳細信息:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
      });

      const timestamp = Date.now();
      const randomNum = Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      const fileName = `${timestamp}-${randomNum}${extension}`;

      logger.info(`文件名生成完成:`, {
        原始文件名: file.originalname,
        時間戳: timestamp,
        隨機數: randomNum,
        副檔名: extension,
        最終文件名: fileName,
      });

      logger.info(`正在調用 filename 回調函數`);
      cb(null, fileName);
      logger.info(`filename 回調函數調用完成`);
    },
  });

  // 創建 multer 實例並添加事件監聽
  const uploader = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB 限制，可根據需要調整
    },
    fileFilter: (req, file, cb) => {
      logger.info(
        `文件過濾檢查開始 - 文件: ${file.originalname}, MIME: ${file.mimetype}`
      );

      // 暫時允許所有文件類型，避免過濾器阻止上傳
      logger.info(`文件類型檢查通過 (允許所有類型): ${file.mimetype}`);
      logger.info(`正在調用 fileFilter 回調函數`);
      cb(null, true);
      logger.info(`fileFilter 回調函數調用完成`);

      // 如果需要限制文件類型，可以取消下面的註釋
      /*
      const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      
      if (allowedMimes.includes(file.mimetype)) {
        logger.info(`文件類型檢查通過: ${file.mimetype}`);
        cb(null, true);
      } else {
        logger.warn(`文件類型不被允許: ${file.mimetype} - 文件: ${file.originalname}`);
        cb(new Error(`不支持的文件類型: ${file.mimetype}`), false);
      }
      */
    },
  });

  // 包裝 multer 中間件以添加更多日誌
  const wrappedUploader = {
    single: (fieldName: string) => {
      logger.info(`配置單文件上傳 - 字段名: ${fieldName}`);
      const middleware = uploader.single(fieldName);

      return (req: any, res: any, next: any) => {
        logger.info(`開始處理單文件上傳請求 - 字段: ${fieldName}`);
        logger.info(`請求詳細信息:`, {
          method: req.method,
          url: req.url,
          headers: req.headers["content-type"],
          contentLength: req.headers["content-length"],
        });

        middleware(req, res, (error) => {
          logger.info(`multer 中間件執行完成，檢查結果...`);

          if (error) {
            logger.error(`文件上傳失敗 - 字段: ${fieldName}`, {
              錯誤信息: error.message,
              錯誤類型: error.constructor.name,
              錯誤堆棧: error.stack,
              完整錯誤: error,
            });
            return next(error);
          }

          logger.info(`檢查 req.file 是否存在...`);
          if (req.file) {
            logger.info(`單文件上傳成功:`, {
              字段名: fieldName,
              原始文件名: req.file.originalname,
              保存文件名: req.file.filename,
              文件路徑: req.file.path,
              文件大小: `${req.file.size} bytes`,
              MIME類型: req.file.mimetype,
              目標目錄: req.file.destination,
            });
          } else {
            logger.warn(`未收到文件 - 字段: ${fieldName}`);
            logger.info(`req 對象中的文件相關屬性:`, {
              file: req.file,
              files: req.files,
              body: Object.keys(req.body || {}),
            });
          }

          logger.info(`準備調用 next() 函數`);
          next();
          logger.info(`next() 函數調用完成`);
        });
      };
    },

    array: (fieldName: string, maxCount?: number) => {
      logger.info(
        `配置多文件上傳 - 字段名: ${fieldName}, 最大數量: ${maxCount || "無限制"}`
      );
      const middleware = uploader.array(fieldName, maxCount);

      return (req: any, res: any, next: any) => {
        logger.info(`開始處理多文件上傳請求 - 字段: ${fieldName}`);

        middleware(req, res, (error) => {
          if (error) {
            logger.error(`多文件上傳失敗 - 字段: ${fieldName}`, {
              錯誤信息: error.message,
              錯誤類型: error.constructor.name,
              完整錯誤: error,
            });
            return next(error);
          }

          if (req.files && Array.isArray(req.files)) {
            logger.info(
              `多文件上傳成功 - 共 ${req.files.length} 個文件:`,
              req.files.map((file: any) => ({
                原始文件名: file.originalname,
                保存文件名: file.filename,
                文件路徑: file.path,
                文件大小: `${file.size} bytes`,
                MIME類型: file.mimetype,
              }))
            );
          } else {
            logger.warn(`未收到文件 - 字段: ${fieldName}`);
          }

          next();
        });
      };
    },

    fields: (fields: multer.Field[]) => {
      logger.info(`配置多字段文件上傳:`, fields);
      const middleware = uploader.fields(fields);

      return (req: any, res: any, next: any) => {
        logger.info(`開始處理多字段文件上傳請求`);

        middleware(req, res, (error) => {
          if (error) {
            logger.error(`多字段文件上傳失敗`, {
              錯誤信息: error.message,
              錯誤類型: error.constructor.name,
              完整錯誤: error,
            });
            return next(error);
          }

          if (req.files) {
            logger.info(`多字段文件上傳成功:`, req.files);
          } else {
            logger.warn(`未收到任何文件`);
          }

          next();
        });
      };
    },
  };

  logger.info(`上傳器創建完成 - 子目錄: ${subDir}`);
  return wrappedUploader;
};
