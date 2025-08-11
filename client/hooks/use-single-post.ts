import useSWR from "swr";

interface PostUser {
  id: number;
  username: string;
  avatarPath?: string;
}

export interface Post {
  categoryId: number;
  id: number;
  title: string;
  body: string;
  bodyjson?: Record<string, unknown>;
  coverImagePath: string;
  updatedAt: string;
  user?: PostUser;
}

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("文章獲取失敗");
  return response.json();
};

export const usePost = ({ id }: { id?: number }) => {
  const doFetch = typeof id === "number" && id > 0;

  const { data, error, isLoading, mutate } = useSWR(
    doFetch ? `${SERVER_URL}/api/blog/post/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      refreshInterval: 5000,
    }
  );

  return {
    post: data,
    error,
    isLoading,
    refreshPost: mutate,
  };
};
