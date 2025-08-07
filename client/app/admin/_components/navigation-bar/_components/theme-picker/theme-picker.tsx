import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminMenu() {
  return (
    <div className="theme-bar flex gap-6">
      <Link href={"/admin/list"}>
        <Button
          variant="ghost"
          value={"1"}
          className="theme-item p-[10px] text-md cursor-pointer text-zinc-500 transition-all duration-200"
        >
          文章列表
        </Button>
      </Link>
      <Link href={"/admin/new"}>
        <Button
          variant="ghost"
          value={"2"}
          className="theme-item p-[10px] text-md cursor-pointer text-zinc-500 transition-all duration-200"
        >
          文章新增
        </Button>
      </Link>
      <Button
        variant="ghost"
        value={"3"}
        className="theme-item p-[10px] text-md cursor-pointer text-zinc-500 transition-all duration-200"
      >
        主題管理
      </Button>
    </div>
  );
}
