"use client";
import PostCard from "@/components/post-card/post-card";
import { usePosts } from "@/hooks/use-post";
import PostPagination from "../post-pagination/post-pagination";
import { UsePostsParams } from "@/types/post";

export default function PostList({
  categoryId,
  author,
  title,
  status = "PUBLISHED",
  initialData,
}: UsePostsParams) {
  const {
    posts,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePostsPageChange,
    refreshPosts,
    pageButtonGenerator,
    canGoPrevious,
    canGoNext,
  } = usePosts({
    limit: 20,
    categoryId,
    author,
    title,
    status,
    initialData,
  });

  if (isLoading && !posts?.length) return <p>載入中...</p>;
  if (error) return <p role="alert">發生錯誤：{error.message}</p>;
  if (!posts?.length) {
    return (
      <p className="text-gray-600 text-sm font-bold py-10">沒有找到文章</p>
    );
  }
  return (
    <div className="post-container flex flex-col gap-6 justify-center items-center">
      <div className="post-list grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <PostPagination
        currentPage={currentPage}
        handlePostsPageChange={handlePostsPageChange}
        pageButtonGenerator={pageButtonGenerator}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </div>
  );
}
