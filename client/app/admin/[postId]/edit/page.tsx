"use client";

import { useParams } from "next/navigation";
import { usePost } from "../../../../hooks/use-single-post";
import PostForm from "../../_components/post-form/post-form";
import useCategories from "@/hooks/use-categories";

export default function EditPage() {
  const params = useParams<{ postId: string }>();
  const id = Number(params.postId);

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const { post, isLoading: postLoading, error: postError } = usePost({ id });

  if (categoriesLoading || postLoading) return <div>載入中...</div>;

  if (categoriesError) return <div>取得分類失敗</div>;
  if (postError) return <div>取得文章失敗</div>;
  if (!post) return <div>找不到文章</div>;

  const initialData = {
    id: post.id,
    title: post.title,
    content: {
      body: post.body,
      bodyJson: post.bodyJson,
    },
    categoryId: post.categoryId || 0,
    coverImagePath: post.coverImagePath,
  };

  return (
    <PostForm mode="edit" initialData={initialData} categories={categories} />
  );
}
