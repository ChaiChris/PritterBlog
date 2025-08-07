"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ThemePickerProps = {
  themes: { id: number; name: string }[];
};

export default function ThemePicker({ themes }: ThemePickerProps) {
  const pathneme = usePathname();
  const currentThemeId = pathneme.startsWith("/blog/theme/")
    ? pathneme.split("/blog/theme/")[1]
    : "";

  const isActive = (themeId: number | null) => {
    return (
      currentThemeId === String(themeId) ||
      (currentThemeId === "" && themeId === null)
    );
  };
  return (
    <div className="theme-bar flex gap-6">
      <Link href={`/blog`}>
        <Button
          variant="ghost"
          className={`theme-item p-[10px] font-bold cursor-pointer transition-all duration-500 hover:text-sky-700 ${
            isActive(null) ? "text-sky-800 text-shadow-xs" : "text-zinc-500"
          }`}
        >
          所有文章
        </Button>
      </Link>
      {themes.length > 0 ? (
        themes.map((theme) => (
          <Link href={`/blog/theme/${theme.id}`} key={theme.id}>
            <Button
              variant="ghost"
              className={`theme-item p-[10px] font-bold cursor-pointer transition-all duration-500 hover:text-sky-700 ${
                isActive(theme.id) ? "text-sky-800" : "text-zinc-500"
              }`}
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
