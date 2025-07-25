import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt.type";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("ENV 缺少 JWT_SECRET ");
}

export const signToken = (payload: JwtPayload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET_KEY) as JwtPayload;
};
