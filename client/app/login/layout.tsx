// components/layout/DashboardLayout.tsx
import React from "react";
import styles from "./_styles/login.module.scss";
import { clsx } from "clsx";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = true;
  const isArticle = false;
  return (
    <div className={clsx(styles.login_bg, "flex flex-col min-h-screen")}>
      <header className="w-full flex justify-between items-center bg-neutral-200/80 backdrop-blur-md h-[80px] shadow-sm px-6">
        <div className="action-left-side flex flex-col gap-2">
          {isArticle ? (
            <Link
              href="/article"
              className="back-btn bg-zinc-800/10 text-zinc-50 px-5 py-3 rounded-xl hover:bg-zinc-800/30 transition-colors"
            >
              <div className="text-zinc-800 flex items-center gap-2">
                <ChevronLeft className="text-zinc-800" /> 返回文章列表
              </div>
            </Link>
          ) : (
            <div className="text-lg text-zinc-800">Pritter Blog</div>
          )}
        </div>
        <div className="user-right-side flex justify-center items-center h-full">
          <div className="user-info-panel flex items-center divide-x divide-zinc-400">
            <div className="flex items-center gap-3 px-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-zinc-800 text-lg">Chris</div>
            </div>

            {isAdmin && (
              <Link href="./" className="flex items-center px-3 text-zinc-600">
                管理員頁面
              </Link>
            )}
          </div>
        </div>
      </header>

      <header className="w-full flex justify-center items-center">
        <div className="max-w-180 w-full text-center p-6">
          <h1 className="text-2xl font-bold text-zinc-50 text-shadow-md">
            Pritter Blog
          </h1>
          <p className="text-zinc-50 text-shadow-md">歡迎來到 Pritter Blog</p>
        </div>
      </header>
      {/* main */}
      <main className="flex flex-col flex-1 justify-center items-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
      {/* footer */}
      <div className="w-full flex justify-center items-center">
        <footer className="max-w-180 w-full text-sm text-gray-700 p-6 pt-10 border-t flex justify-between items-top">
          <div className="left-side flex flex-col gap-2">
            <div className="font-bold text-lg text-zinc-50">Pritter Blog</div>
            <div className="text-zinc-50">@2025</div>
          </div>
          <div className="right-side flex flex-col gap-2">
            <div className="text-zinc-50 text-shadow-md">+886 00000000000</div>
            <div className="text-zinc-50">service@pritter.com</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
