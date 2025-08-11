import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { format } from "date-fns";
import { Comment } from "@/types/comment";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  if (!comment) return <></>;
  const username = comment.user?.username || "匿名用戶";
  const avatarPath = comment.user?.avatarPath || "/placeholder-user.jpg";

  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
          {comment.user ? (
            <>
              <AvatarImage
                src={comment.user?.avatarPath ? comment.user.avatarPath : ""}
                alt={comment.user ? comment.user?.username : "匿名"}
              />
              <AvatarFallback className="flex justify-center items-center text-center">
                {comment.user?.username?.slice(0, 1)}
              </AvatarFallback>
            </>
          ) : (
            <>
              <>
                <AvatarImage
                  src="https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="匿名"
                />
                <AvatarFallback>?</AvatarFallback>
              </>
            </>
          )}
        </Avatar>
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <div className="font-medium">
              {comment.user ? comment.user?.username : "匿名"}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(comment.updatedAt, "dd MMMM yyyy hh:mm")}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{comment.body}</div>
        </div>
      </div>
    </>
  );
}
