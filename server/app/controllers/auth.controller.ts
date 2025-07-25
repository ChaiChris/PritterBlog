import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { client } from "../prisma/client";

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

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const checkUser = await client.user.findUnique({ where: { email } });
  if (checkUser) {
    return res.status(401).json({ message: "該使用者已註冊" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await client.user.create({
    data: {
      email,
      password: hashedPassword,
      username: username,
    },
  });

  const token = signToken({ id: newUser.id });
  return res.status(201).json({ token });
};

export const checkUserName = async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await client.user.findUnique({ where: { username } });
  if (user) {
    return res.status(200).json({ hasNameUsed: true });
  }
  return res.status(200).json({ hasNameUsed: false });
};
