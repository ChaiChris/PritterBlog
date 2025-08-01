import { Button } from "@/components/ui/button";
import Link from "next/link";

type ThemePickerProps = {
  themes: { id: number; name: string }[];
};

export default function ThemePicker({ themes }: ThemePickerProps) {
  return (
    <div className="theme-bar flex gap-6">
      <Button
        variant="ghost"
        className="theme-item p-[10px] cursor-pointer text-zinc-800 text-shadow-md transition-all duration-200"
      >
        最新文章
      </Button>
      {themes.length > 0 ? (
        themes.map((theme) => (
          <Link href={`/themes/${theme.id}`} key={theme.id}>
            <Button
              variant="ghost"
              className="theme-item p-[10px] cursor-pointer text-zinc-400 transition-all duration-500"
            >
              {theme.name}
            </Button>
          </Link>
        ))
      ) : (
        <span className="text-zinc-400">網路錯誤</span>
      )}
    </div>
  );
}
