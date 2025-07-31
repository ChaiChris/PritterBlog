import useSWR, { mutate } from "swr";
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";
const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });

export function useCurrentUser() {
  const { data, error } = useSWR(`${SERVER_URL}/api/auth/get/user`, fetcher);
  if (error) {
    console.error("useCurrentUser ERROR:", error);
  }
  if (!data) {
    console.log("useCurrentUser: 正在載入使用者資訊...");
  } else {
    console.log("useCurrentUser: 成功載入使用者資訊", data);
  }
  return {
    user: data ?? null,
    isLoading: !error && !data,
    isError: error,
    refresh: () => mutate("/api/auth/get/user"),
  };
}
