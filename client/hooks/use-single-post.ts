import useSWR from "swr";

interface PostUser {
  id: number;
  username: string;
  avatarPath?: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  coverImagePath: string;
  updatedAt: string;
  user?: PostUser;
}

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

export const usePost = ({ id }: { id?: number }) => {
  const doFetch = typeof id === "number" && id > 0;

  const { data, error, isLoading, mutate } = useSWR<Post>(
    doFetch ? `${SERVER_URL}/api/blog/${id}` : null,
    async ([_, id]) => {
      const response = await fetch(`${SERVER_URL}/api/blog/posts/${id}`);
      if (!response.ok) throw new Error("文章獲取失敗");
      return response.json();
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      refreshInterval: 5000,
    }
  );

  return {
    post: data,
    isLoading,
    error,
    refreshPost: mutate,
  };
};
