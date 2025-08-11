"use client";

import PostForm from "../_components/post-form/post-form";
import useCategories from "@/hooks/use-categories";

export default function NewPostPage() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>載入分類失敗</div>;

  return <PostForm mode="create" categories={categories} />;
}
