"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  isLogin?: boolean;
  isAdmin?: boolean;
  isArticle?: boolean;
}

export default function Header({
  isLogin = false,
  isAdmin = false,
  isArticle = false,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 z-50 w-full flex justify-between items-center bg-neutral-100/10 backdrop-blur-md h-[80px] px-6">
      <div className="flex flex-col gap-2">
        {isArticle ? (
          <Button
            asChild
            variant="ghost"
            className="text-zinc-800 px-5 py-3 rounded-xl"
          >
            <Link href="/article" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              返回文章列表
            </Link>
          </Button>
        ) : (
          <div className="text-lg text-zinc-800 font-semibold">
            Pritter Blog
          </div>
        )}
      </div>

      <div className="flex items-center h-full">
        {isLogin && (
          <div className="flex items-center divide-x divide-zinc-300 rounded-xl   bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-zinc-800 text-base font-medium">
                Chris Wood
              </span>
            </div>

            {isAdmin && (
              <Button
                asChild
                variant="ghost"
                className="text-zinc-600 px-4 py-2"
              >
                <Link href="/">管理員頁面</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
