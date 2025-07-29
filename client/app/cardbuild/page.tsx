import { clsx } from "clsx";
import PostCard from "@/components/post-card/post-card";
import { fetchPosts } from "@/lib/api";
import PostList from "@/app/cardbuild/_components/post-list/post-list";

export default async function cardBuild() {
  const posts = await fetchPosts();
  return (
    <>
      {/*<PostCard post={post} />*/}
      <PostList posts={posts} />
    </>
  );
}
