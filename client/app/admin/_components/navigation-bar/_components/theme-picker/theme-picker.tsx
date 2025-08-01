import { Button } from "@/components/ui/button";

export default function AdminMenu() {
  return (
    <div className="theme-bar flex gap-6">
      <Button
        variant="ghost"
        value={"1"}
        className="theme-item p-[10px] cursor-pointer text-zinc-400 text-shadow-md transition-all duration-200"
      >
        文章列表
      </Button>
      <Button
        variant="ghost"
        value={"2"}
        className="theme-item p-[10px] cursor-pointer text-zinc-400 text-shadow-md transition-all duration-200"
      >
        文章新增
      </Button>
      <Button
        variant="ghost"
        value={"3"}
        className="theme-item p-[10px] cursor-pointer text-zinc-400 text-shadow-md transition-all duration-200"
      >
        主題管理
      </Button>
    </div>
  );
}
