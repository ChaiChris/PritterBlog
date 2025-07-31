"use client";
import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/api";
import PostList from "@/app/blog/_components/post-list/post-list";
import NavigationBar from "@/app/blog/_components/navigation-bar/navigation-bar";
import Header from "@/components/layout/header";

export default function Blog() {
  const [theme, setTheme] = useState("new");

  return (
    <>
      <Header isArticle={false} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[80px]">
        {/*<PostCard post={post} />*/}
        <div className="flex flex-col gap-6 ">
          {/*<NavigationBar themes={themes} />*/}
          <NavigationBar />
          <PostList theme={""} />
          <PostList theme={""} />
          <PostList theme={""} />
        </div>
      </main>
    </>
  );
}
