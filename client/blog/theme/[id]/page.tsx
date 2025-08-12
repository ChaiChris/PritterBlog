import PostList from "@/components/post-list/post-list";
import NavigationBar from "@/components/navigation-bar/navigation-bar";
import Header from "@/components/layout/header";

type BlogThemesProps = {
  params: Promise<{ id: string }>;
};

export default async function BlogWithThemes({ params }: BlogThemesProps) {
  const { id } = await params;
  const categoryId = Number(id) || 0;
  return (
    <>
      <Header isArticle={false} />
      <main className="flex mx-auto flex-1 p-6 pt-[80px] container">
        {/*<PostCard post={post} />*/}
        <div className="flex flex-col gap-6 container mx-auto justify-center items-center">
          {/*<NavigationBar themes={themes} />*/}
          <NavigationBar />
          <PostList categoryId={categoryId} author="" title="" status="" />
        </div>
      </main>
    </>
  );
}
