import Header from "@/components/layout/header";
import AuthorPanel from "./_components/author-panel/author-panel";
import CommentBlock from "./_components/comment-block/comment-block";
import PostViewer from "./_components/post-viewer/post-viewer";

export default function Blog() {
  return (
    <>
      <Header isArticle={true} />
      <main className="flex flex-col flex-1 justify-center items-center p-6 pt-[120px] pd-[80px]">
        <div className="w-full">
          <AuthorPanel />
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
          <PostViewer />
        </div>
      </main>
      <CommentBlock />
    </>
  );
}
