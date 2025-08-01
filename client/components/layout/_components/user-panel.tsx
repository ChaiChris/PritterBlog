import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logoutUser } from "@/lib/auth";

export default function UserPanel() {
  const { user, isLoading, isError, refresh } = useCurrentUser();
  const handleLogout = async () => {
    try {
      await logoutUser(); // 呼叫後端 API 清除 cookie/token
      refresh(); // 用於重抓當前使用者（或強制讓 useSWR 返回 null）
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  if (isLoading || isError || !user) {
    return (
      <div className="flex items-center h-full space-x-4">
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
  if (user) {
    return (
      <div className="flex items-center h-full space-x-4">
        <div className="flex items-center rounded-xl bg-white/30 shadow-md overflow-hidden backdrop-blur-lg">
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
            <Button variant="ghost" className="text-zinc-600 ">
              <Link href="/admin">管理員頁面</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            className="text-red-600"
            onClick={handleLogout}
          >
            登出
          </Button>
        </div>
      </div>
    );
  }
}
