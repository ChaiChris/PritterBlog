import sanitize from "sanitize-html";
import parse, { DOMNode } from "html-react-parser";
import Image from "next/image";
import { Element as DomElement } from "domhandler";

export function postHtmlRender(html: string) {
  // 清理 HTML
  const cleanHtml = sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
  });

  // 圖片處理成 NEXT Image 元件
  const options = {
    replace: (domNode: DOMNode) => {
        if (domNode && domNode instanceof DomElement  && (domNode as DomElement).name === 'img') {
            const { src, alt, width, height } = (domNode as DomElement).attribs;
            if (!src || (!src.startsWith("http") && !src.startsWith("/"))) return null;
            return (
                <Image
                    src={src || ''}
                    alt={alt || ''}
                    width={width ? parseInt(width, 10) : 500}
                    height={height ? parseInt(height, 10) : 300}
                    className="rounded-md"
                    style={{ height: 'auto' }}
                />
            );
        }
        return undefined;
    }
  };

  return parse(cleanHtml, options);
}
