"use client";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { CommentResponse } from "@/types/comment";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export function useCommentsInfinite(
  postId: number,
  initialComment: CommentResponse
) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const getKey = (
    pageIndex: number,
    previousPageData: CommentResponse | null
  ) => {
    if (pageIndex === 0)
      return `${SERVER_URL}/api/blog/post/${postId}/comments?limit=10`;
    if (!previousPageData?.nextCursor) return null;
    return `${SERVER_URL}/api/blog/post/${postId}/comments?limit=10&cursor=${encodeURIComponent(previousPageData.nextCursor)}`;
  };

  const { data, size, setSize, error } = useSWRInfinite<CommentResponse>(
    getKey,
    fetcher,
    {
      fallbackData: initialComment ? [initialComment] : undefined,
    }
  );

  // 過濾 undefined page
  const pages = Array.isArray(data) ? data.filter(Boolean) : [];

  // 每頁可能是 undefined 或 nextCursor 為 null
  const comments = pages.flatMap((page) => page?.comments ?? []);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && typeof data?.[size - 1] === "undefined");
  const isEnd = pages.length > 0 ? !pages[pages.length - 1]?.nextCursor : false;

  useEffect(() => {
    if (isLoadingMore || isEnd) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        ticking = true;
        setSize((prev) => prev + 1);
        // 防抖
        setTimeout(() => (ticking = false), 700);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoadingMore, isEnd, setSize]);

  return {
    comments,
    error,
    isLoadingInitialData,
    isLoadingMore,
    isEnd,
    loadMore: () => setSize((prev) => prev + 1),
    rawPages: data,
    setSize,
  };
}
