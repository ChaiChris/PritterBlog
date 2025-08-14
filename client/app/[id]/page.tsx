import Header from "@/components/layout/header";
import AuthorPanel from "./_components/author-panel/author-panel";
import CommentBlock from "./_components/comment-block/comment-block";
import PostViewer from "./_components/post-viewer/post-viewer";
import Image from "next/image";
import { Comment } from "@/types/comment";

const imageBaseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SERVER_URL
    : process.env.NEXT_PUBLIC_LOCAL_SERVER_URL;
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

async function fetchPostCommentsData(postId: number) {
  const postUrl = `${SERVER_URL}/api/blog/post/${postId}`;
  const commentUrl = `${SERVER_URL}/api/blog/post/${postId}/comments?limit=10`;
  try {
    const [postRes, commentRes] = await Promise.all([
      fetch(postUrl, { method: "GET", next: { revalidate: 60 } }), // 60 秒快取
      fetch(commentUrl, { method: "GET", next: { revalidate: 60 } }),
    ]);
    if (!postRes.ok) throw new Error("文章獲取失敗");
    if (!commentRes.ok) throw new Error("評論獲取失敗");

    const postData = await postRes.json();
    const commentsData = await commentRes.json();

    // 處理回傳的資料
    const post = {
      id: postData.id,
      title: postData.title,
      body: postData.body,
      bodyText: postData.bodyText || "",
      coverImagePath: postData.coverImagePath || "",
      updatedAt: postData.updatedAt || new Date().toISOString(),
      user: postData.user
        ? {
            id: postData.user.id,
            username: postData.user.username,
            avatarPath: postData.user.avatarPath || "",
          }
        : undefined,
    };

    // 過濾並組成 CommentResponse
    const commentsResponse = {
      comments: Array.isArray(commentsData.comments)
        ? commentsData.comments.filter(
            (c: Comment) =>
              typeof c.id === "number" &&
              typeof c.body === "string" &&
              typeof c.postId === "number"
          )
        : [],
      nextCursor: commentsData.nextCursor || null,
    };

    return { post, initialComments: commentsResponse };
  } catch (error) {
    console.error("[fetchPostCommentsData] Failed:", error);
    return null;
  }
}
export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  // console.log("[Blog Page] Post ID:", postId);
  if (isNaN(postId) || postId <= 0) {
    return <div>無效的文章 ID</div>;
  }
  const data = await fetchPostCommentsData(postId);
  if (!data) {
    return <div>資料載入失敗</div>;
  }
  const { post, initialComments } = data;

  // for docker network env
  const coverPicSrc = post?.coverImagePath
    ? `${imageBaseUrl}${new URL(post.coverImagePath).pathname}`
    : "";
  // console.log("[coverPicSrc]", coverPicSrc);

  return (
    <>
      <div className="bg-pic h-[500px] w-full relative">
        <Image
          src={coverPicSrc}
          alt="cover"
          fill
          className="object-cover object-center"
        />
      </div>
      <Header isArticle={true} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[20px] pd-[80px]">
        <div className="w-full">
          <AuthorPanel user={post.user} postDate={post.updatedAt} />
          {post ? (
            <PostViewer post={post} />
          ) : (
            <p className="text-red-700">ERROR 文章載入失敗</p>
          )}
        </div>
      </main>
      <CommentBlock postId={post.id} initialComments={initialComments} />
    </>
  );
}
