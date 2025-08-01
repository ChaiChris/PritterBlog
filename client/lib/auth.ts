import { LoginInput, RegisterInput } from "@/types/auth";
import axios from "axios";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

//axios 實例
export const axiosUserInstance = axios.create({
  baseURL: `${SERVER_URL}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
    if (res.status === 200 || res.status === 201) {
      console.log("registerUser: 成功註冊");
      return true;
    } else {
      console.error("registerUser: ERROR 註冊失敗", res.data);
      throw new Error("註冊失敗，請稍後再試");
    }
  } catch (error: any) {
    console.error("registerUser error", error);
    throw new Error(
      error?.response?.data?.message || "註冊時發生錯誤，請稍後再試"
    );
  }
}

export async function loginUser(input: LoginInput) {
  console.log(`loginUser 觸發 使用：${SERVER_URL}`);
  const { email, password } = input;
  if (!email || !password) {
    console.log('loginUser: ERROR 缺少登入值"');
    throw new Error("請檢查 email 和 password");
  }
  try {
    const res = await axiosUserInstance.post("/login", {
      email,
      password,
    });

    if (res.status === 200) {
      console.log("loginUser: 成功登入");
      return true;
    } else {
      console.error("loginUser: ERROR 登入失敗", res.data);
      throw new Error("登入失敗，請稍後再試");
    }
  } catch (error: any) {
    console.error("loginUser: ERROR 登入失敗", error);
    throw new Error(error?.response?.data?.message || "登入失敗，請稍後再試");
  }
}

export async function logoutUser() {
  console.log(`logoutUser 觸發 使用：${SERVER_URL}`);

  try {
    const res = await axiosUserInstance.post("/logout");

    if (res.status === 200) {
      console.log("logoutUser: 成功登出");
      return true;
    } else {
      console.error("logoutUser: 非 200 回應", res.status, res.data);
      throw new Error("登出失敗，請稍後再試");
    }
  } catch (err: any) {
    console.error("logoutUser: ERROR", err?.response?.data || err.message);
    throw new Error("登出失敗，請檢查網路或稍後再試");
  }
}

// export async function getUserInfo() {
//   console.log(`getUserInfo 觸發 使用：${SERVER_URL}`);
//   const res = await axiosUserInstance.get<User>("/profile");
//   if (res.status === 200) {
//     console.log("getUserInfo: 成功獲取使用者資訊", res.data);
//     return res.data;
//   } else {
//     console.error("getUserInfo: ERROR 獲取使用者資訊失敗", res.data);
//     throw new Error("獲取使用者資訊失敗，請稍後再試");
//   }
// }
