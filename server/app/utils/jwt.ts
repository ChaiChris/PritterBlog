import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { logger } from "../logger.js";

if (!process.env.JWT_SECRET) {
  throw new Error("ENV 缺少 JWT_SECRET");
}

type TokenPayload = {
  id: number;
  [key: string]: unknown;
};

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: JWTPayload): Promise<string> {
  logger.info("SECRET_KEY: ", Array.from(SECRET_KEY));
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
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (!token || typeof token !== "string") {
      throw new Error("Payload 格式錯誤");
    }
    return payload as TokenPayload;
  } catch (err) {
    console.error("驗證 token 失敗:", err);
    throw new Error("無效的或過期的 JWT");
  }
}
