import "express";
import { JWTPayload } from "jose";

// declare module "express" {
//   interface Request {
//     user?: { id: number };
//   }
// }

declare global {
  namespace Express {
    interface Request {
      cookies: {
        token?: string;
        [key: string]: any;
      };
      user?: {
        userId: number;
        role?: "ADMIN" | "USER";
        email?: string;
        [key: string]: any;
      };
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}
