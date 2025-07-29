import { cookies } from "next/headers";
import jsonwebtoken from "jsonwebtoken";

export async function getCurrentUserDataFromToken() {
  // 只從 jsonwebtoken 拿 verify，不要拿 get
  const { verify } = jsonwebtoken;

  const cookieStorage = await cookies();
  const token = cookieStorage.get("token")?.value;

  if (!token) return null;

  try {
    return verify(token, process.env.JWT_SECRET!) as {
      id: number;
      name: string;
      email: string;
      avatarUrl: string;
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}
