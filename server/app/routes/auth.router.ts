import express from "express";
import {
  login,
  register,
  checkUserName,
  checkUserEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/check/email", checkUserEmail);
router.post("/check/name", checkUserName);
export default router;
