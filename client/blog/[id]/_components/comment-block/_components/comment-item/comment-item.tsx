"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Comment } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (id: number) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!comment) return null;

  const username = comment.user?.username ?? "匿名";
  const avatarSrc = comment.user?.avatarPath ?? "";
  const avatarFallback = comment.user?.username?.[0] ?? "?";
  const formattedDate = comment.updatedAt
    ? format(new Date(comment.updatedAt), "dd MMMM yyyy hh:mm")
    : "";

  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar className="border">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={username} />
          ) : (
            <AvatarImage
              src="https://images.unsplash.com/photo-1619252584172-a83a949b6efd"
              alt="匿名"
            />
          )}
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <div className="font-medium">{username}</div>
            {formattedDate && (
              <div className="text-xs text-muted-foreground">
                {formattedDate}
              </div>
            )}
          </div>

          {comment.isAuthor && (
            <Button
              variant="ghost"
              size="sm"
              className={
                "text-xs font-light p-0 w-12 h-5 cursor-pointer pb-3 text-gray-500 hover:text-red-700"
              }
              onClick={() => setDeleteDialogOpen(true)}
            >
              刪除評論
            </Button>
          )}

          <div className="text-sm text-muted-foreground">{comment.body}</div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>刪除評論</DialogTitle>
            <DialogDescription>你確定要刪除這則評論嗎？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (onDelete) await onDelete(comment.id);
                setDeleteDialogOpen(false);
              }}
            >
              確定刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
