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
const buildUrlParams = (params: PostQuery): string => {
  const searchParams = new URLSearchParams();
  // 轉換成 key + value，並依判斷加入searchParams
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

// 把 HTML 轉成純文字方便 /blog 卡片顯示
function htmlToText(html: string): string {
  return sanitize(html, { allowedTags: [], allowedAttributes: {} });
}

export const usePosts = (params: UsePostsParams = {}): usePostsReturn => {
  const { limit = 20, categoryId, author, title, status, initialData } = params;
  const [currentPage, setCurrentPage] = useState(1);

  // skip 值計算（第一頁不計算所以 currentPage -1 後開始計算）
  const skip = (Number(currentPage) - 1) * Number(limit);

  // 拼湊查詢條件
  const queryString = useMemo(() => {
    const queryParams: PostQuery = {
      limit: Number(limit),
      skip: Number(skip),
      categoryId: categoryId ? Number(categoryId) : undefined,
      author,
      title,
      status,
    };
    return buildUrlParams(queryParams); // 把條件組成URL字串
  }, [limit, skip, categoryId, author, title, status]);

  const url = useMemo(
    () => `${SERVER_URL}/api/blog/posts?${queryString}`,
    [queryString]
  );

  // console.log("[usePosts] API URL:", url);

  // 獲取資料
  const { data, error, isLoading, mutate } = useSWR<PostsResponse>(
    url,
    fetcher,
    {
      fallbackData: initialData, // 使用 SSR 抓取的資料
      revalidateOnMount: currentPage === 1 && !initialData, // 第一頁不觸發初次抓取資料，而是使用 SSR 抓取的資料
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // 2秒內不重複請求
      focusThrottleInterval: 2000, // 2秒內不重複焦點請求
      refreshInterval: 10000, // 10秒刷新一次
      errorRetryCount: 3, // 失敗重試次數
    }
  );

  // console.log("[usePosts] Fetched Data:", data);

  const pageButtonGenerator = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    // 最大可見的頁碼按鈕數
    const maxVisiblePages = 5;
    const totalPages = data?.totalPages || 0;
    // console.log("[usePosts] Total Pages:", totalPages);
    // 小於 maxVisiblePages 則直接輸出
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 在前三頁則輸出四個+ ellipsis +最後一個頁碼按鈕
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
        // 在最後兩頁則輸出第一頁+ ellipsis +最後四個頁碼按鈕
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 在中間頁則輸出第一頁+ellipsis +包括前後共三頁 +ellipsis +最後一頁按鈕
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

  // 額外取總頁數並回傳，頁面有需要可以使用
  const totalPages = data?.totalPages || 0;

  // 把每則文章內容 html 格式轉換成純文字，方便文章卡片呈現
  const posts =
    (data?.posts ?? []).map((p) => ({
      ...p,
      bodyText: htmlToText(p.body || ""),
    })) || [];

  // 處理頁面頁數切換
  const handlePostsPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 重新整理
  const refreshPosts = () => {
    mutate();
  };

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
