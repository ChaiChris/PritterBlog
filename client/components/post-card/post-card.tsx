import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCardProps } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { stringToColor } from "@/render/avatar-colour-render";

export default function PostCard({ post }: PostCardProps) {
  const relativePath = new URL(post.coverImagePath).pathname;
  return (
    <>
      <Link href={`/${post.id}`} className="no-underline">
        <Card className="relative group cursor-pointer w-[280px] h-[330px] mx-auto py-0 overflow-hidden shadow text-white rounded-xl">
          {/* 卡片背景 */}
          <Image
            src={relativePath}
            alt="cover-img"
            width={280}
            height={330}
            quality={35}
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* 濾鏡 */}
          <div className="absolute inset-0 z-10 bg-black/35 transition-all duration-700 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-lg" />

          {/* 內容 */}
          <div className="relative z-20 py-5 gap-5">
            <CardHeader className="flex items-center py-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  {post?.user?.avatarPath ? (
                    <AvatarImage
                      className="shadow-sm"
                      src={post.user.avatarPath}
                      alt="User-Avatar"
                    />
                  ) : (
                    <AvatarFallback
                      className="text-zinc-600"
                      style={{
                        backgroundColor: stringToColor(
                          post?.user?.username || "",
                        ),
                      }}
                    >
                      {post?.user?.username?.[0] ?? "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="text-white/80 text-shadow-sm text-sm font-bold">
                    {post?.user?.username?.trim() || "匿名"}
                  </div>
                  <div className="text-xs text-shadow-xs text-zinc-100/80">
                    {format(post?.updatedAt, `dd MMMM yyyy`) || ""}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="text-2xl/7 text-zinc-50/90 font-bold text-shadow-sm line-clamp-3">
                {post?.title || ""}
              </div>
              <div className="line-clamp-5 text-zinc-50/80 text-md text-shadow-sm tracking-wide">
                {post?.bodyText || ""}
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </>
  );
}
