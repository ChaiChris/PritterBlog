"use client";
import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/api";
import PostList from "@/app/blog/_components/post-list/post-list";
import NavigationBar from "@/app/blog/_components/navigation-bar/navigation-bar";
import Header from "@/components/layout/header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import { CornerDownRight } from "lucide-react";

export default function Blog() {
  const [theme, setTheme] = useState("new");

  return (
    <>
      <Header isArticle={true} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[120px]">
        <div className="w-full">
          <div className="flex flex-col justify-center items-center gap-3 px-4 py-3">
            <Avatar>
              <AvatarImage src="https://github.com/leerob.png" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <span className="text-zinc-800 font-bold text-lg ">Chris Wood</span>
            <div className="publish text-sm flex items-center">
              <div className="publish">發佈於：</div>
              <div className="publish">2023年10月1日</div>
            </div>
          </div>
          <article className="rounded-2xl p-4 prose prose-lg text-zinc-800 max-w-4xl mx-auto">
            <div className="flex items-center h-full space-x-4"></div>
            <h2>文章標題</h2>
            <p>
              這段文字是用 Tailwind CSS
              模擬紙張樣式的部落格內文。你可以自由套用不同的排版類型與標題格式。
            </p>
            <h3>段落標題</h3>
            <p>
              使用 Tailwind 的 `prose` 類別可讓 Markdown
              風格文章自動擁有良好的排版設計。這對於部落格非常實用。
            </p>
            <ul>
              <li>支援標題</li>
              <li>清單</li>
              <li>程式碼區塊</li>
            </ul>
            <h2>文章標題</h2>
            <p>
              這段文字是用 Tailwind CSS
              模擬紙張樣式的部落格內文。你可以自由套用不同的排版類型與標題格式。
            </p>
            <h3>段落標題</h3>
            <p>
              使用 Tailwind 的 `prose` 類別可讓 Markdown
              風格文章自動擁有良好的排版設計。這對於部落格非常實用。
            </p>
            <ul>
              <li>支援標題</li>
              <li>清單</li>
              <li>程式碼區塊</li>
            </ul>
            <h2>文章標題</h2>
            <p>
              這段文字是用 Tailwind CSS
              模擬紙張樣式的部落格內文。你可以自由套用不同的排版類型與標題格式。
            </p>
            <h3>段落標題</h3>
            <p>
              使用 Tailwind 的 `prose` 類別可讓 Markdown
              風格文章自動擁有良好的排版設計。這對於部落格非常實用。
            </p>
            <ul>
              <li>支援標題</li>
              <li>清單</li>
              <li>程式碼區塊</li>
            </ul>
          </article>
        </div>
      </main>
      <div className="comment-block border-t border-neutral-200 p-6 max-w-4xl mx-auto pt-12">
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
                This is a great product! I've been using it for a week and it's
                been a game-changer.
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
                I'm really impressed with the quality and performance of this
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
                I've been using this product for a while and it's been
                consistently reliable. Definitely worth the investment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
