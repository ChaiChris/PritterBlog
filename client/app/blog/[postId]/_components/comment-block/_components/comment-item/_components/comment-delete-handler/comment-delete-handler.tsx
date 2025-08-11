"use client";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

type DeleteHandlertypes = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: number | null;
  onDeleted?: () => void; // 刪除成功後 callback
};

export default function CommentDeleteHandler({
  open,
  onOpenChange,
  targetId,
  onDeleted,
}: DeleteHandlertypes) {
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    const SERVER_URL =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
    if (!targetId) return;
    setLoading(true);
    try {
      await axios.delete(`${SERVER_URL}/api/blog/comment/${targetId}`, {
        withCredentials: true,
      });
      toast.success("刪除成功！");
      onOpenChange(false);
      onDeleted?.();
    } catch (err) {
      console.error(err);
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>刪除留言</DialogTitle>
        </DialogHeader>
        <p>確定要刪除此留言嗎？</p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? "刪除中..." : "確定刪除"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
