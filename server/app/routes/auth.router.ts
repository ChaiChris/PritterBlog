import express from "express";
import {
  login,
  logout,
  register,
  checkUserName,
  checkUserEmail,
  getProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/check/email", checkUserEmail);
router.post("/check/name", checkUserName);
router.get("/get/user", authMiddleware, getProfile);
export default router;
