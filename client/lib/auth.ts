import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(token: string): string | jwt.JwtPayload | null {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
