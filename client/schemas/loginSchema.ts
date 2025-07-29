import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email 格式錯誤"),
  password: z.string().min(6, "密碼至少 6 個字元"),
});

export type loginFormValues = z.infer<typeof loginSchema>;
