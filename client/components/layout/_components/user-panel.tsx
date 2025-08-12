"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logoutUser } from "@/lib/auth";

export default function UserPanel() {
  const { user, isLoading, isError, refresh } = useCurrentUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
      refresh();
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  // 未登入狀態
  if (isLoading || isError || !user) {
    return (
      <div className="flex items-center h-full space-x-4 rounded-sm bg-gray-50/60 backdrop-blur-lg">
        <Link href="/login">
          <Button
            variant="ghost"
            className="text-stone-500 px-2 py-2 cursor-pointer"
          >
            登入
          </Button>
        </Link>
        <Link href="/signup">
          <Button
            variant="ghost"
            className="text-stone-500 px-2 py-2 cursor-pointer"
          >
            註冊
          </Button>
        </Link>
      </div>
    );
  }

  // 已登入狀態
  return (
    <div className="flex items-center h-full">
      {/* 桌面版 */}
      <div className="hidden sm:flex items-center rounded-xl bg-gray-50/60 backdrop-blur-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2">
          <Avatar>
            <AvatarImage src={user.avatarPath} />
            <AvatarFallback>
              {user.username?.slice(0, 1) || "？"}
            </AvatarFallback>
          </Avatar>
          <span className="text-zinc-800 text-base font-medium">
            {user.username ?? "使用者"}
          </span>
        </div>
        {user.role === "ADMIN" && (
          <Button variant="ghost" className="text-zinc-600">
            <Link href="/admin">管理員頁面</Link>
          </Button>
        )}
        <Button variant="ghost" className="text-red-600" onClick={handleLogout}>
          登出
        </Button>
      </div>

      {/* 手機版菜單 */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer shadow-2xl">
              <AvatarImage src={user.avatarPath} />
              <AvatarFallback>
                {user.username?.slice(0, 1) || "？"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.role === "ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/admin">管理員頁面</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
