import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { logger } from "../logger.js";

if (!process.env.JWT_SECRET) {
  throw new Error("ENV 缺少 JWT_SECRET");
}

// 目前 Token 只使用 id/role
type TokenPayload = {
  id: number;
  email?: string;
  name?: string;
  role?: string;
};

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: JWTPayload): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET_KEY);
  } catch (error) {
    logger.error("簽署 token 失敗:", error);
    throw new Error("JWT 生成失敗");
  }
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // 先檢查 token，再進行驗證
    if (!token || typeof token !== "string" || token.trim() === "") {
      throw new Error("Token 格式錯誤：必須是非空字串");
    }
    const { payload } = await jwtVerify(token, SECRET_KEY);
    logger.info("[JWT] 驗證成功");
    return payload as TokenPayload;
  } catch (err) {
    console.error("驗證 token 失敗:", err);

    if (err instanceof Error) {
      if (err.message.includes("JWSInvalid")) {
        throw new Error("JWT 格式無效");
      } else if (err.message.includes("JWTExpired")) {
        throw new Error("JWT 已過期");
      } else if (err.message.includes("Token 格式錯誤")) {
        throw err;
      }
    }

    throw new Error("無效的或過期的 JWT");
  }
}
