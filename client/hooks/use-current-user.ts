import useSWR, { mutate } from "swr";
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (res.status === 401) {
      console.info("未登入");
      return null; // null 表示未授權
    }
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });

export function useCurrentUser() {
  const { data, error, mutate } = useSWR(
    `${SERVER_URL}/api/auth/get/user`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    user: data, // null 代表未登入
    isLoading: !error && !data, // loading檢查
    isError: error,
    refresh: () => mutate("/api/auth/get/user"),
  };
}
