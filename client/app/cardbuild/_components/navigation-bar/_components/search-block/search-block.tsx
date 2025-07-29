import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBlock() {
  return (
    <div className="search-block">
      <div className="flex items-center w-full max-w-sm space-x-2 rounded-2xl bg-transparent px-3.5 py-2">
        <SearchIcon className="h-4 w-4" />
        <input
          className="w-full h-8 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border-0  rounded-md px-3 py-2 transition duration-300 ease focus:outline-none "
          placeholder="搜尋文章"
        />
      </div>
    </div>
  );
}
