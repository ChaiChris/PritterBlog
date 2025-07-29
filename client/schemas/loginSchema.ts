import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, { message: "密碼錯誤" }),
});

export type loginFormValues = z.infer<typeof loginSchema>;
