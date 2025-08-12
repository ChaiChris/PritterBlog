import axios from "axios";

const isServer = typeof window === "undefined";

const SERVER_URL = isServer
  ? process.env.NEXT_PUBLIC_SERVER_URL || "http://server:8081"
  : process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:8081";

export const axiosCategoryInstance = axios.create({
  baseURL: `${SERVER_URL}/api/category`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function handleAxiosError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  if (axios.isAxiosError(error)) {
    throw new Error(
      (error.response?.data as { message?: string })?.message || defaultMessage
    );
  }
  throw error;
}

// SWR fetcher
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await axiosCategoryInstance.get<T>(url);
  return res.data;
};

// 取得主題
export async function getCategoriesList() {
  try {
    const res = await axiosCategoryInstance.get("/all");
    return res.data;
  } catch (error) {
    handleAxiosError(error, "獲取分類列表時發生錯誤，請稍後再試");
  }
}

// 取得主題文章
export async function getCategoryPosts(categoryId: number) {
  try {
    const res = await axiosCategoryInstance.get(`/posts/${categoryId}`);
    return res.data;
  } catch (error) {
    handleAxiosError(error, "獲取分類文章時發生錯誤，請稍後再試");
  }
}
