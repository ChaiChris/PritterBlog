"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CornerDownRight } from "lucide-react";
import { useState } from "react";
import useAddComment from "@/hooks/use-add-comment";
import { mutate } from "swr";

interface CommentAddForm {
  postId: number;
  onSuccess: () => void;
}

export default function CommentAddForm({ postId, onSuccess }: CommentAddForm) {
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(false);
  const { addComment } = useAddComment(Number(postId));
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit");
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      setLoading(true);
      // console.log("Adding comment:", commentBody);
      await addComment(commentBody);
      setCommentBody("");
      onSuccess();
    } catch (err) {
      alert("留言新增失敗，請稍後再試");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Textarea
          placeholder="發表留言..."
          value={commentBody}
          className="resize-none rounded-sm border border-input p-3 text-sm shadow-sm"
          onChange={(e) => setCommentBody(e.target.value)}
          disabled={loading}
        />
        <div className="w-full flex justify-end">
          <Button
            variant={"ghost"}
            type="submit"
            disabled={loading || !commentBody.trim()}
            className="justify-center shadow-sm cursor-pointer rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center gap-2 px-4 py-2 text-zinc-50 hover:text-zinc-50 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "留言中..." : "留言"} <CornerDownRight />
          </Button>
        </div>
      </div>
    </form>
  );
}
