import ThemePicker from "@/app/blog/_components/navigation-bar/_components/theme-picker/theme-picker";
import SearchBlock from "@/app/blog/_components/navigation-bar/_components/search-block/search-block";

export default function NavigationBar() {
  return (
    <div className="w-full flex justify-between items-center py-[16px]">
      <ThemePicker />
      <SearchBlock />
    </div>
  );
}
