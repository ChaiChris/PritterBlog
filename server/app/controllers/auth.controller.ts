import { Request, Response } from "express";
import { checkUserService, registerService } from "../services/auth.service";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { client } from "../prisma/client";
import { z } from "zod";
import { CheckUserName, RegisterInput } from "../types/auth.type";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await client.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "找不到該使用者" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "登入驗證失敗" });
  }

  const token = signToken({ id: user.id });
  return res.status(200).json({ token });
};

const UserRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(3).max(50),
});

export const register = async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = UserRegisterSchema.parse(req.body);
    const result = await registerService(input);
    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
};

export const checkUserName = async (req: Request, res: Response) => {
  const userNameInput: CheckUserName = req.body;
  try {
    const result = await checkUserService(userNameInput);
    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(400).json({ message: e.message });
  }
};
