import axios from "axios";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

export const axiosCategoryInstance = axios.create({
  baseURL: `${SERVER_URL}/api/category`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export const fetcher: <T = any>(url: string) => Promise<T> = async (
  url: string
) => {
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
  } catch (error: any) {
    console.error("getCategoriesList error", error);
    throw new Error(
      error?.response?.data?.message || "獲取分類列表時發生錯誤，請稍後再試"
    );
  }
}

export async function getCategoryPosts(categoryId: number) {
  try {
    const res = await axiosCategoryInstance.get(`/posts/${categoryId}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("獲取分類文章失敗");
    }
  } catch (error: any) {
    console.error("getCategoryPosts error", error);
    throw new Error(
      error?.response?.data?.message || "獲取分類文章時發生錯誤，請稍後再試"
    );
  }
}
