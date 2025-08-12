import { mutate } from "swr";

export default function useAddComment(postId: number) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:8081";
  const addComment = async (body: string) => {
    const res = await fetch(
      `${SERVER_URL}/api/blog/uploads/comment/${postId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body }),
      }
    );

    const newComment = await res.json();

    // 更新全局 mutate ，在新增留言後更新列表
    await mutate(
      (key) =>
        typeof key === "string" &&
        key.startsWith(`${SERVER_URL}/api/blog/post/${postId}/comments`)
    );
    return newComment;
  };
  return { addComment };
}
