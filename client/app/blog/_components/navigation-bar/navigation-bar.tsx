import ThemePicker from "@/app/blog/_components/navigation-bar/_components/theme-picker/theme-picker";
import SearchBlock from "@/app/blog/_components/navigation-bar/_components/search-block/search-block";
import { getCategoriesList } from "@/lib/category";

export default async function NavigationBar() {
  const categories = await getCategoriesList();
  return (
    <div className="w-full flex justify-between items-center py-[16px]">
      <ThemePicker themes={categories} />
      <SearchBlock />
    </div>
  );
}
