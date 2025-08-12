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

export default function DeleteHandler({
  open,
  onOpenChange,
  targetId,
  onDeleted,
}: DeleteHandlertypes) {
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    const SERVER_URL =
      process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:8081";
    if (!targetId) return;
    setLoading(true);
    try {
      await axios.delete(`${SERVER_URL}/api/blog/post/${targetId}`, {
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
          <DialogTitle>刪除文章</DialogTitle>
        </DialogHeader>
        <p>此操作將無法復原，確認刪除這筆資料？</p>
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
