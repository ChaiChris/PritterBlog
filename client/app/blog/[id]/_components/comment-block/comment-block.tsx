import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CornerDownRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
export default function CommentBlock() {
  return (
    <div className="comment-block border-t border-neutral-200 p-6 max-w-4xl mx-auto pt-20">
      <h2 className="text-3xl w-full text-center font-bold mb-4">留言區</h2>
      <div className="mx-auto max-w-2xl space-y-6 py-6">
        <div className="grid gap-2">
          <Textarea
            placeholder="發表你的看法..."
            className="resize-none rounded-md border border-input p-3 text-sm shadow-sm"
          />
          <div className="w-full flex justify-end">
            <Button
              variant={"ghost"}
              className="justify-center shadow-sm cursor-pointer w-[100px] rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center gap-2 px-4 py-2 text-zinc-50 hover:text-zinc-50 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
            >
              發表 <CornerDownRight />
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-6 py-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <div className="font-medium">Olivia Davis</div>
              <div className="text-xs text-muted-foreground">2 days ago</div>
            </div>
            <div className="text-sm text-muted-foreground">
              This is a great product! I&apos;ve been using it for a week and
              it&apos;s been a game-changer.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <div className="font-medium">Noah Williams</div>
              <div className="text-xs text-muted-foreground">5 days ago</div>
            </div>
            <div className="text-sm text-muted-foreground">
              I&apos;m really impressed with the quality and performance of this
              product. Highly recommended!
            </div>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <div className="font-medium">Emma Brown</div>
              <div className="text-xs text-muted-foreground">1 week ago</div>
            </div>
            <div className="text-sm text-muted-foreground">
              I&apos;ve been using this product for a while and it&apos;s been
              consistently reliable. Definitely worth the investment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
