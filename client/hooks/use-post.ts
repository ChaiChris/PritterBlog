"use client";
import { PostCard } from "@/types/post";
import { useMemo, useState } from "react";
import sanitize from "sanitize-html";
import useSWR from "swr";

interface PostsResponse {
  posts: PostCard[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface UsePostsParams {
  limit?: number;
  categoryId?: number;
  author?: string;
  title?: string;
  status?: string;
  initialData?: PostsResponse;
}

interface usePostsReturn {
  posts: PostCard[];
  total: number;
  totalPages: number;
  currentPage: number;

  isLoading: boolean;
  error: Error | null;

  handlePostsPageChange: (page: number) => void;
  refreshPosts: () => void;

  pageButtonGenerator: () => (number | string)[];
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const SERVER_URL =
  process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:8081";

const fetcher = async (url: string): Promise<PostsResponse> => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("文章列表獲取失敗");
  return response.json();
};

// 查詢參數轉換函式
interface PostQuery {
  limit?: number;
  skip?: number;
  categoryId?: number;
  author?: string;
  title?: string;
  status?: string;
}
const buildQueryParams = (params: PostQuery): string => {
  const searchParams = new URLSearchParams();
  // 轉換成 key + value，並依判斷加入searchParams
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

// 把 tiptap HTML 轉成純文字方便 /blog 卡片顯示
function htmlToText(html: string): string {
  return sanitize(html, { allowedTags: [], allowedAttributes: {} });
}

export const usePosts = (params: UsePostsParams = {}): usePostsReturn => {
  const { limit = 20, categoryId, author, title, status, initialData } = params;
  const [currentPage, setCurrentPage] = useState(1);

  // skip 值計算
  const skip = (Number(currentPage) - 1) * Number(limit);

  // 查詢參數
  const queryString = useMemo(() => {
    const queryParams: PostQuery = {
      limit: Number(limit),
      skip: Number(skip),
      categoryId: categoryId ? Number(categoryId) : undefined,
      author,
      title,
      status,
    };
    return buildQueryParams(queryParams);
  }, [limit, skip, categoryId, author, title, status]);

  const url = useMemo(
    () => `${SERVER_URL}/api/blog/posts?${queryString}`,
    [queryString]
  );

  console.log("[usePosts] API URL:", url);

  // 獲取資料
  const { data, error, isLoading, mutate } = useSWR<PostsResponse>(
    url,
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnMount: currentPage === 1 && !initialData,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // 重新載入\不使用快取
    }
  );

  // console.log("[usePosts] Fetched Data:", data);

  // 處理頁面變更
  const handlePostsPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const refreshPosts = () => {
    mutate();
  };

  const pageButtonGenerator = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    const totalPages = data?.totalPages || 0;
    console.log("[usePosts] Total Pages:", totalPages);
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const totalPages = data?.totalPages || 0;

  const posts =
    (data?.posts ?? []).map((p) => ({
      ...p,
      bodyText: htmlToText(p.body || ""),
    })) || [];

  return {
    // 數據
    posts: posts || [],
    total: data?.total || 0,
    totalPages,
    currentPage,
    // 狀態
    isLoading,
    error,

    handlePostsPageChange,
    refreshPosts,

    // 分頁
    pageButtonGenerator,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
};
