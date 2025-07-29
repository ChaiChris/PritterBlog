import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUserDataFromToken } from "@/lib/auth";

export default function UserPanel() {
  const user = await getCurrentUserDataFromToken();
  return (
    <div className="flex items-center h-full space-x-4">
      {isLogin ? (
        <div className="flex items-center divide-x divide-zinc-300 rounded-xl bg-white shadow-sm overflow-hidden">
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
            <Button asChild variant="ghost" className="text-zinc-600 px-4 py-2">
              <Link href="/admin">管理員頁面</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            className="text-red-500 px-4 py-2"
            onClick={onLogout}
          >
            登出
          </Button>
        </div>
      ) : (
        <Button variant="default" onClick={onLogin}>
          登入
        </Button>
      )}
    </div>
  );
}
