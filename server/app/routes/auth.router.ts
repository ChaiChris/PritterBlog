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

const app = express.Router();
app.post("/login", login);
app.post("/logout", authMiddleware, logout);
app.post("/register", register);
app.post("/check/email", checkUserEmail);
app.post("/check/name", checkUserName);
app.get("/get/user", authMiddleware, getProfile);
export default app;
