//無限滾動的游標回傳資料轉換函式
//base64雙向轉換查詢字串

import { logger } from "../logger.js";

export function encodeCursor(createdAt: Date, id: number) {
  return Buffer.from(
    JSON.stringify({ createdAt: createdAt.toISOString(), id })
  ).toString("base64");
}

export function decodeCursor(cursor: string) {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (e) {
    logger.error("[decodeCursor] 轉換失敗", e);
    throw new Error("[decodeCursor] Invalid cursor");
  }
}
