"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import UserPanel from "./_components/user-panel";

interface HeaderProps {
  isArticle?: boolean;
}

export default function Header({ isArticle = false }: HeaderProps) {
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full flex flex-row justify-between items-center h-[60px] sm:h-[80px] px-4 sm:px-6`}
    >
      <div className="flex items-center min-w-0">
        {isArticle ? (
          <Button
            asChild
            variant="ghost"
            className="text-zinc-800 px-3 py-2 sm:px-5 sm:py-3 rounded-xl bg-gray-50/60 backdrop-blur-lg"
          >
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span className="truncate">返回文章列表</span>
            </Link>
          </Button>
        ) : (
          <div className="text-lg text-zinc-800 font-extrabold rounded-xl bg-gray-700/0 backdrop-blur-lg px-3 py-2">
            Pritter Blog
          </div>
        )}
      </div>

      <div className="flex items-center justify-end shrink-0">
        <UserPanel />
      </div>
    </header>
  );
}
