import { PostListProps } from "@/types/post";
import PostCard from "@/components/post-card/post-card";

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="post-list grid grid-col-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
