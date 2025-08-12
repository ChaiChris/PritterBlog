import Header from "@/components/layout/header";
import AuthorPanel from "./_components/author-panel/author-panel";
import CommentBlock from "./_components/comment-block/comment-block";
import PostViewer from "./_components/post-viewer/post-viewer";
import Image from "next/image";
import { Comment } from "@/types/comment";

async function fetchPostCommentsData(postId: number) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const postUrl = `${SERVER_URL}/api/blog/post/${postId}`;
  const commentUrl = `${SERVER_URL}/api/blog/post/${postId}/comments?limit=10`;
  try {
    const [postRes, commentRes] = await Promise.all([
      fetch(postUrl, { method: "GET", next: { revalidate: 60 } }),
      fetch(commentUrl, { method: "GET", next: { revalidate: 60 } }),
    ]);
    if (!postRes.ok) throw new Error("文章獲取失敗");
    if (!commentRes.ok) throw new Error("評論獲取失敗");

    const postData = await postRes.json();
    const commentsData = await commentRes.json();

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

// interface BlogPostInput {
//   params: {
//     postId: string | number;
//   };
// }

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  console.log("[Blog Page] Post ID:", postId);
  if (isNaN(postId) || postId <= 0) {
    return <div>無效的文章 ID</div>;
  }
  const data = await fetchPostCommentsData(postId);
  if (!data) {
    return <div>資料載入失敗</div>;
  }
  const { post, initialComments } = data;
  return (
    <>
      <div className="bg-pic h-[500px] w-full relative">
        <Image
          src={post?.coverImagePath}
          alt="cover"
          fill
          className="object-cover object-center"
        />
      </div>
      <Header isArticle={true} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[20px] pd-[80px]">
        <div className="w-full">
          <AuthorPanel user={post.user} postDate={post.updatedAt} />
          {/* <article className="rounded-2xl p-4 prose prose-lg text-zinc-800 max-w-4xl mx-auto">
            <div className="text-5xl font-bold py-5">
              I&apos;ve been using this product for a while and it&apos;s been
              consistently reliable. Definitely worth the investment.
            </div>
            <div className="post-container">
              <p>
                這段文字是用 Tailwind CSS
                模擬紙張樣式的部落格內文。你可以自由套用不同的排版類型與標題格式。
              </p>
              <h3>段落標題</h3>
              <p>
                使用 Tailwind 的 `prose` 類別可讓 Markdown
                風格文章自動擁有良好的排版設計。這對於部落格非常實用。
              </p>
              <ul>
                <li>支援標題</li>
                <li>清單</li>
                <li>程式碼區塊</li>
              </ul>
              <h2>文章標題</h2>
              <p>
                這段文字是用 Tailwind CSS
                模擬紙張樣式的部落格內文。你可以自由套用不同的排版類型與標題格式。
              </p>
              <h3>段落標題</h3>
              <p>
                使用 Tailwind 的 `prose` 類別可讓 Markdown
                風格文章自動擁有良好的排版設計。這對於部落格非常實用。
              </p>
              <ul>
                <li>支援標題</li>
                <li>清單</li>
                <li>程式碼區塊</li>
              </ul>
              <h2>文章標題</h2>
              <p>
                這段文字是用 Tailwind CSS
                模擬紙張樣式的部落格內文。你可以自由套用不同的排版類型與標題格式。
              </p>
              <h3>段落標題</h3>
              <p>
                使用 Tailwind 的 `prose` 類別可讓 Markdown
                風格文章自動擁有良好的排版設計。這對於部落格非常實用。
              </p>
              <ul>
                <li>支援標題</li>
                <li>清單</li>
                <li>程式碼區塊</li>
              </ul>
            </div>
          </article> */}
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
