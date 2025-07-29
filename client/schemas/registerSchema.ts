import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3, "使用者名稱至少3字元").max(20, "最多20字元"),
    email: z.email("請輸入有效 Email"),
    password: z.string().min(6, "密碼至少6碼"),
    confirmPassword: z.string().min(6, "密碼確認至少6碼"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "確認密碼不相同",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
