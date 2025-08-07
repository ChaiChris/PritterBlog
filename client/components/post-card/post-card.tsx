import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCardProps } from "@/types/post";
import Image from "next/image";

export default function PostCard({ post }: PostCardProps) {
  return (
    <>
      <Card className="relative group cursor-pointer w-[280px] h-[330px] mx-auto py-0 overflow-hidden shadow-sm text-white rounded-2xl">
        {/* 背景圖層 */}
        <Image
          src={`${post.coverImagePath}`}
          alt="cover"
          width={280}
          height={330}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* 濾鏡層 */}
        <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-xs transition-all duration-700 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-md" />

        {/* 內容層 */}
        <div className="relative z-20 py-5 gap-5">
          <CardHeader className="flex items-center py-2">
            <div className="flex items-center gap-2">
              <Avatar>
                {post?.user?.avatarPath ? (
                  <AvatarImage
                    className="shadow-sm"
                    src={post.user.avatarPath}
                    alt="@shadcn"
                  />
                ) : (
                  <AvatarFallback className="text-zinc-600 text-xs shadow-sm bg-stone-50/70">
                    {post?.user?.username?.[0] ?? "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="text-white/90 text-shadow-xs">
                  {post?.user?.username?.trim() || "匿名"}
                </div>
                <div className="text-xs text-shadow-xs text-zinc-100/80">
                  {post?.updatedAt || ""}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-xl/8 text-zinc-50/90 font-bold text-shadow-md py-2 line-clamp-3">
              {post?.title || ""}
            </div>
            <div className="line-clamp-5 text-zinc-50/80 text-md text-shadow-md tracking-wide">
              {post?.bodyText || ""}
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
