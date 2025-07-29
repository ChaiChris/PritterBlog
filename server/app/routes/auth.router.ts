import express from "express";
import {
  login,
  register,
  checkUserName,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/check", checkUserName);
export default router;
