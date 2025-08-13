import PostList from "@/components/post-list/post-list";
import NavigationBar from "@/components/navigation-bar/navigation-bar";
import Header from "@/components/layout/header";
import { SWRConfig } from "swr";

interface SearchTypes {
  searchParams: {
    author?: string;
    title?: string;
  };
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ author?: string; title?: string }>;
}) {
  const { author, title } = await searchParams;
  // SSR SEO友善預載
  let initialData = [];
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const url = new URL(`${SERVER_URL}/api/blog/posts`);
  url.searchParams.append("limit", "20");
  url.searchParams.append("skip", "0");
  if (author) url.searchParams.append("author", author);
  if (title) url.searchParams.append("title", title);

  try {
    // console.log("[Blog SSR] Fetching initial data from:", url);
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      initialData = await res.json();
      // console.log("SSR initialData:", initialData);
      // console.log("Blog posts data:", initialData);
    }
  } catch (error) {
    console.error("[Blog SSR] Failed to fetch initial data:", error);
  }

  return (
    <>
      <Header isArticle={false} />
      <main className="flex mx-auto flex-1 p-6 pt-[80px] container">
        {/*<PostCard post={post} />*/}
        <div className="flex flex-col gap-6 container mx-auto justify-center items-center">
          {/*<NavigationBar themes={themes} />*/}
          <NavigationBar />
          {/* 使用 SWRConfig PostList 來提供初始資料 */}
          <SWRConfig
            value={{
              fallback: {
                [url.toString()]: initialData,
              },
            }}
          >
            <PostList
              author={author}
              title={title}
              initialData={
                initialData ?? {
                  posts: [],
                  total: 0,
                  totalPages: 0,
                  currentPage: 1,
                }
              }
            />
          </SWRConfig>
        </div>
      </main>
    </>
  );
}
