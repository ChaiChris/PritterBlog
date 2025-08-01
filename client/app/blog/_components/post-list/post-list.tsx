"use client";
import PostCard from "@/components/post-card/post-card";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/lib/api";
import { PostCard as PostCardProps } from "@/types/post";
import { Link } from "lucide-react";

export default function PostList({ theme }: { theme: string }) {
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPosts();
      setPosts(data);
    };

    fetchData();
  }, []);
  return (
    <div className="post-list grid grid-col-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
