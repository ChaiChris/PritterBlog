import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";

export type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
};

export async function getCurrentUserDataFromToken(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET!,
    ) as unknown;

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("id" in payload) ||
      !("email" in payload)
    ) {
      return null;
    }

    return payload as User;
  } catch (err) {
    console.log("JWT 驗證錯誤:", err);
    return null;
  }
}
