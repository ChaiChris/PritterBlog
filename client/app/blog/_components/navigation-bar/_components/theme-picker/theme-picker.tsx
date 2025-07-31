import { Button } from "@/components/ui/button";

export default function ThemePicker() {
  return (
    <div className="theme-bar flex gap-6">
      <Button
        variant="ghost"
        value={"1"}
        className="theme-item p-[10px] cursor-pointer text-zinc-800 text-shadow-md transition-all duration-200"
      >
        最新文章
      </Button>
      <Button
        variant="ghost"
        value={"2"}
        className="theme-item p-[10px] cursor-pointer text-zinc-400 transition-all duration-500"
      >
        美食
      </Button>
      <Button
        variant="ghost"
        value={"3"}
        className="theme-item p-[10px] cursor-pointer text-zinc-400 transition-all duration-500"
      >
        旅遊
      </Button>
    </div>
  );
}
