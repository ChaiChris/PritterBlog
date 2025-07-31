import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapViewerProps {
  content: any;
}

export default function TipTapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-lg max-w-none">
      <EditorContent editor={editor} className="prose prose-lg prose-zinc" />
    </div>
  );
}
