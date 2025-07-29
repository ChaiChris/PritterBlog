import { LoginPanel } from "@/app/login/_components/login-panel";

import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCardProps } from "@/types/post";

export default function PostCard({ post }: PostCardProps) {
  return (
    <>
      <Card className="relative group cursor-pointer w-[280px] mx-auto py-0 overflow-hidden shadow-sm text-white rounded-2xl">
        {/* 背景圖層 */}
        <img
          src="https://plus.unsplash.com/premium_photo-1724593825200-39731dcdacf8?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="cover"
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* 濾鏡層 */}
        <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm transition-all duration-700 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-md" />

        {/* 內容層 */}
        <div className="relative z-20 py-5 gap-5">
          <CardHeader className="flex items-center py-2">
            <div className="flex items-center gap-2">
              <Avatar>
                {post?.author?.avatarUrl ? (
                  <AvatarImage
                    className="shadow-sm"
                    src={post.author.avatarUrl}
                    alt="@shadcn"
                  />
                ) : (
                  <AvatarFallback className="text-zinc-600 text-xs shadow-sm">
                    {post?.author?.name?.[0] ?? "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="text-white/90 text-shadow-xs">
                  {post?.author?.name?.trim() || "匿名"}
                </div>
                <div className="text-xs text-shadow-xs text-zinc-100/80">
                  {post?.createdAt || ""}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl/8 text-zinc-50/90 font-bold tracking-wide text-shadow-md py-2">
              {post?.title || ""}
            </div>
            <div className="line-clamp-5 text-zinc-50/80 text-md text-shadow-md tracking-wide">
              {post?.content || ""}
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
