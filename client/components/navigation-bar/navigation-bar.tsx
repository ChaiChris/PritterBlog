import ThemePicker from "@/components/navigation-bar/_components/theme-picker/theme-picker";
import SearchBlock from "@/components/navigation-bar/_components/search-block/search-block";
import { getCategoriesList } from "@/lib/category";

export default async function NavigationBar() {
  let categories = [];

  try {
    categories = await getCategoriesList();
  } catch (error) {
    console.error("取得主題列表失敗:", error);
  }
  return (
    <div className="w-full max-w-[1280px] flex flex-wrap md:flex-nowrap justify-between items-center gap-4 py-4">
      <ThemePicker themes={categories} />
      <SearchBlock />
    </div>
  );
}
