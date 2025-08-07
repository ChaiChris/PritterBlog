"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import UserPanel from "./_components/user-panel";
interface HeaderProps {
  isArticle?: boolean;
}
// ${isArticle ? "backdrop-blur-lg" : ""}
export default function Header({ isArticle = false }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full  flex justify-between items-center h-[80px] px-6`}
    >
      <div className="flex flex-col gap-2">
        {isArticle ? (
          <Button
            asChild
            variant="ghost"
            className="text-zinc-800 px-5 py-3 rounded-xl"
          >
            <Link href="/blog" className="flex items-center gap-2">
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
        <UserPanel />
      </div>
    </header>
  );
}
