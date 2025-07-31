import { LoginInput, RegisterInput, User } from "@/types/auth";
import axios from "axios";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

//axios 實例
export const axiosUserInstance = axios.create({
  baseURL: `${SERVER_URL}/api/auth`,
  withCredentials: true,
});

export const fetcher: <T = any>(url: string) => Promise<T> = async (
  url: string
) => {
  const res = await axiosUserInstance.get<T>(url);
  return res.data;
};

export async function registerUser(input: RegisterInput) {
  // api/auth/register
  console.log(`registerUser 觸發 使用：${SERVER_URL}`);
  try {
    const { username, password, email } = input;
    if (!username || !password || !email) {
      console.log('registerUser: ERROR 缺少註冊值"');
      throw new Error("registerUser: ERROR 缺少註冊值");
    }
    const res = await axiosUserInstance.post("/register", {
      username,
      password,
      email,
    });
    return res.data;
  } catch (error: any) {
    console.error("registerUser error", error);
    throw new Error(error?.res?.data?.message || "註冊時發生錯誤，請稍後再試");
  }
}

export async function loginUser(input: LoginInput) {
  console.log(`loginUser 觸發 使用：${SERVER_URL}`);
  const { email, password } = input;
  if (!email || !password) {
    console.log('loginUser: ERROR 缺少登入值"');
    throw new Error("loginUser: ERROR 缺少登入值");
  }
  const res = await fetch(`${SERVER_URL}/api/auth/login`, {
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

export async function logoutUser() {}

// export async function getUserInfo() {
//   console.log(`getUserInfo 觸發 使用：${SERVER_URL}`);
//   const res = await fetch(`${SERVER_URL}/api/auth/get/user`, {
//     method: "GET",
//     credentials: "include",
//   });
//   if (!res.ok) {
//     const error = await res.json();
//     console.error("getUserInfo error", error);
//     throw new Error(`getUserInfo: 無法取得使用者資訊：${error.message}`);
//   }
//   const userInfo: User = await res.json();
//   return userInfo;
// }
