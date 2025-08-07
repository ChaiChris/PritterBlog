import useSWR from "swr";
import { getCategoriesList } from "@/lib/category"; // 你原本的位置

interface Category {
  id: number;
  name: string;
}

export default function useCategories() {
  const { data, error, isLoading } = useSWR("categories", getCategoriesList);
  return {
    categories: (data as Category[]) || [],
    error,
    isLoading,
  };
}
