import PostList from "@/app/blog/_components/post-list/post-list";
import NavigationBar from "@/app/blog/_components/navigation-bar/navigation-bar";
import Header from "@/components/layout/header";
import { SWRConfig } from "swr";

export default async function Blog() {
  // SSR SEO友善預載
  let initialData = [];
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const url = `${SERVER_URL}/api/blog/posts?limit=20&skip=0`;
  try {
    console.log("[Blog SSR] Fetching initial data from:", url);
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      initialData = await res.json();
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
          {/* 使用 SWRConfig 提供初始資料 */}
          <SWRConfig
            value={{
              fallback: {
                [url]: initialData,
              },
            }}
          >
            <PostList author="" title="" status="" initialData={initialData} />
          </SWRConfig>
        </div>
      </main>
    </>
  );
}
