import express from "express";
import {
  login,
  logout,
  register,
  getProfile,
  verifyAdminController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const app = express.Router();
app.post("/login", login);
app.post("/logout", authMiddleware, logout);
app.post("/register", register);

// 前端沒有設計使用者資料修改，註冊驗證部分由 registerController 處理，
// app.post("/check/email", checkUserEmail);
// app.post("/check/name", checkUserName);

//權限驗證
app.get("/verify/admin", authMiddleware, verifyAdminController);

//取使用者資料
app.get("/get/user", authMiddleware, getProfile);
export default app;
