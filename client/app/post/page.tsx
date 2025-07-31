"use client";
import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/api";
import PostList from "@/app/home/_components/post-list/post-list";
import NavigationBar from "@/app/home/_components/navigation-bar/navigation-bar";

export default function Post() {
  return (
    <>
      {/*<PostCard post={post} />*/}
      <div className="flex flex-col gap-6 "></div>
    </>
  );
}
