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
      user?: JWTPayload;
    }
  }
}
