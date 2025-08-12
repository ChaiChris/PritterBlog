"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchBlock() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyWord, setKeyWord] = useState(searchParams.get("keyWord") ?? "");
  const [searchType, setSearchType] = useState<"author" | "title">("title");

  useEffect(() => {
    const authorParam = searchParams.get("author");
    const titleParam = searchParams.get("title");

    if (authorParam) {
      setSearchType("author");
      setKeyWord(authorParam);
    } else if (titleParam) {
      setSearchType("title");
      setKeyWord(titleParam);
    } else {
      setSearchType("title");
      setKeyWord("");
    }
  }, [searchParams]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();

    if (keyWord.trim()) {
      if (searchType === "author") {
        query.set("author", keyWord.trim());
      } else {
        query.set("title", keyWord.trim());
      }
    }

    router.push(`/?${query.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex gap-2 justify-center items-center"
    >
      <div className="search-block">
        <div className="flex items-center w-full max-w-sm space-x-2 rounded-2xl bg-transparent px-3.5 py-2">
          <Input
            className="w-full h-8 bg-transparent shadow-none placeholder:text-slate-400 text-slate-700 text-sm border-0 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none "
            placeholder={`搜尋${searchType === "title" ? "標題" : "作者"}`}
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
          />
          <Select
            value={searchType}
            onValueChange={(value) =>
              setSearchType(value as "author" | "title")
            }
          >
            <SelectTrigger className="border-0 shadow-0 text-sm text-slate-500">
              <SelectValue placeholder="搜尋類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="title">標題</SelectItem>
                <SelectItem value="author">作者</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            variant={"ghost"}
            className="rounded-lg text-slate-600 hover:shadow-xl cursor-pointer transition duration-500"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
