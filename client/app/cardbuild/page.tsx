"use client";
import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/api";
import PostList from "@/app/cardbuild/_components/post-list/post-list";
import NavigationBar from "@/app/cardbuild/_components/navigation-bar/navigation-bar";

export default function CardBuild() {
  const [theme, setTheme] = useState("new");

  return (
    <>
      {/*<PostCard post={post} />*/}
      <div className="flex flex-col gap-6 ">
        {/*<NavigationBar themes={themes} />*/}
        <NavigationBar />
        <PostList theme={""} />
        <PostList theme={""} />
        <PostList theme={""} />
      </div>
    </>
  );
}
