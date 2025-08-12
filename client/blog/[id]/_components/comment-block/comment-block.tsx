"use client";
import { CommentResponse } from "@/types/comment";
import CommentAddForm from "./_components/comment-add-form/comment-add-form";
import CommentItem from "./_components/comment-item/comment-item";
import { useCommentsInfinite } from "@/hooks/use-comment";
import { mutate } from "swr";
import axios from "axios";
import { toast } from "sonner";

interface CommentBlockProps {
  postId: number;
  initialComments: CommentResponse;
}

export default function CommentBlock({
  postId,
  initialComments,
}: CommentBlockProps) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  console.log("postId", postId);
  console.log("initialComments", initialComments);
  const {
    comments,
    error,
    isLoadingInitialData,
    isLoadingMore,
    isEnd,
    loadMore,
    setSize,
  } = useCommentsInfinite(Number(postId), initialComments);

  async function handleCommentDelete(id: number) {
    try {
      await axios.delete(`${SERVER_URL}/api/blog/comment/${id}`, {
        withCredentials: true,
      });
      toast.success("刪除成功！");
      setSize(1);
    } catch (err) {
      // console.error(err);
      toast.error("刪除失敗，請稍後再試");
    }
  }

  if (isLoadingInitialData) return <p>載入中…</p>;

  console.log(comments);
  return (
    <div className="comment-block border-t border-neutral-200 p-6 max-w-4xl mx-auto pt-20">
      <h2 className="text-3xl w-full text-center font-bold mb-4">留言</h2>
      <div className="mx-auto max-w-2xl space-y-6 py-6">
        <CommentAddForm
          postId={Number(postId)}
          onSuccess={async () => {
            console.log("Comment added, updating comments...");
            // await mutate(
            //   (key) =>
            //     typeof key === "string" &&
            //     key.startsWith(`${SERVER_URL}/api/blog/post/${postId}/comments`)
            // );
            setSize(1);
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl space-y-6 py-6">
        {isLoadingInitialData && <p>正在載入留言...</p>}
        {error && <p className="text-red-500">載入留言失敗</p>}
        {comments.length === 0 && !isLoadingInitialData && (
          <p className="text-gray-500">目前沒有留言</p>
        )}
        {comments.filter(Boolean).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleCommentDelete}
          />
        ))}
        {/* {isLoadingMore && <p>正在載入更多留言...</p>} */}
        {!isEnd && !isLoadingMore && (
          <button
            onClick={loadMore}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            載入更多留言
          </button>
        )}
      </div>
    </div>
  );
}
