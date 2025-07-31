import { LoginInput, RegisterInput, User } from "@/types/auth";

//
// export async function getCurrentUserDataFromToken(): Promise<User | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;
//
//   if (!token) return null;
//
//   try {
//     const payload = jsonwebtoken.verify(
//       token,
//       process.env.JWT_SECRET!,
//     ) as unknown;
//
//     if (
//       typeof payload !== "object" ||
//       payload === null ||
//       !("id" in payload) ||
//       !("email" in payload)
//     ) {
//       return null;
//     }
//
//     return payload as User;
//   } catch (err) {
//     console.log("JWT 驗證錯誤:", err);
//     return null;
//   }
// }
//
// export async function loginUser(input: LoginInput): Promise<LoginResult> {
//   const { email, password } = input;
//   if (!email || !password) {
//   }
// }

export async function registerUser(input: RegisterInput) {
  const { username, password, email } = input;
  const res = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error("registerUser: ERROR ", error);
  }

  return await res.json();
}

export async function loginUser(input: LoginInput) {
  console.log("loginUser 觸發");
  const { email, password } = input;
  if (!email || !password) {
    console.log('loginUser: ERROR 缺少登入值"');
    throw new Error("loginUser: ERROR 缺少登入值");
  }
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("loginUser: ERROR ", error);
  }
  return await res.json();
}

export async function getUserInfo() {
  const res = await fetch("http://localhost:8080/api/auth/get/user", {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    console.error("getUserInfo error", error);
    throw new Error(`getUserInfo: 無法取得使用者資訊：${error.message}`);
  }
  const userInfo: User = await res.json();
  return userInfo;
}
