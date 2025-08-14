import sanitize from "sanitize-html";
import parse, { DOMNode } from "html-react-parser";
import Image from "next/image";
import { Element as DomElement } from "domhandler";

export function postHtmlRender(html: string) {
  // 清理 HTML標籤來防止 XSS，額外予許 img 標籤
  const cleanHtml = sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
  });

  const options = {
    // 把圖片處理成 NEXT Image 元件
    replace: (domNode: DOMNode) => {
      if (
        domNode &&
        domNode instanceof DomElement &&
        (domNode as DomElement).name === "img"
      ) {
        const { src, alt, width, height } = (domNode as DomElement).attribs;
        if (!src || (!src.startsWith("http") && !src.startsWith("/")))
          return null;
        return (
          <Image
            src={src || ""}
            alt={alt || "content-img"}
            width={width ? parseInt(width, 10) : 500}
            height={height ? parseInt(height, 10) : 300}
            className="rounded-md"
            style={{ height: "auto" }}
          />
        );
      }
      return undefined;
    },
  };

  return parse(cleanHtml, options);
}
