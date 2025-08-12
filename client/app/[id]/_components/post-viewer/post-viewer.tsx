import { postHtmlRender } from "@/render/post-html-render";
import { PostCardProps } from "@/types/post";
import Image from "next/image";

export default function PostViewer({ post }: PostCardProps) {
  return (
    <div className="p-4 max-w-6xl mx-auto pb-10">
      <div className="title py-8 text-6xl font-bold text-gray-700 leading-15">
        {post.title}
      </div>
      <div className="post-container max-w-full prose-lg mx-auto pt-10 prose-h1:font-light prose-h1:text-gray-600 prose-h1:pt-10">
        {postHtmlRender(post.body)}
      </div>
    </div>
  );
}

// const cleanHtml = sanitize(html, {
//   allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
//   allowedAttributes: {
//     ...sanitize.defaults.allowedAttributes,
//     img: ["src", "alt", "width", "height"],
//   },
// });
