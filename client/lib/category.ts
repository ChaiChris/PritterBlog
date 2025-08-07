import axios from "axios";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

export const axiosCategoryInstance = axios.create({
  baseURL: `${SERVER_URL}/api/category`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await axiosCategoryInstance.get<T>(url);
  return res.data;
};

export async function getCategoriesList() {
  try {
    const res = await axiosCategoryInstance.get("/all");
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("獲取分類列表失敗");
    }
  } catch (error: unknown) {
    console.error("getCategoriesList error", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "獲取分類列表時發生錯誤，請稍後再試"
      );
    }
    throw error;
  }
}

export async function getCategoryPosts(categoryId: number) {
  try {
    const res = await axiosCategoryInstance.get(`/posts/${categoryId}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error: unknown) {
    console.error("getCategoryPosts error", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "獲取分類文章時發生錯誤，請稍後再試"
      );
    }
    throw error;
  }
}
