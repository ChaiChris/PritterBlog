import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // @ts-ignore
  const user = await user.findUnique({ email });
  if (!user) {
    res.status(401).json({ message: "找不到該使用者" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: "登入驗證失敗" });
  }

  const token = signToken({ id: user.user });
  res.status(200).json({ token });
};
