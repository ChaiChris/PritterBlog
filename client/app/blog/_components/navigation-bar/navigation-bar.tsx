import ThemePicker from "@/app/blog/_components/navigation-bar/_components/theme-picker/theme-picker";
import SearchBlock from "@/app/blog/_components/navigation-bar/_components/search-block/search-block";
import { getCategoriesList } from "@/lib/category";

export default async function NavigationBar() {
  let categories = [];

  try {
    categories = await getCategoriesList();
  } catch (error) {
    console.error("取得主題列表失敗:", error);
  }
  return (
    <div className="w-full max-w-[1280px] flex justify-between items-center py-[16px]">
      <ThemePicker themes={categories} />
      <SearchBlock />
    </div>
  );
}
