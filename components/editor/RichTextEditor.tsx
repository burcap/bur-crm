"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

export default function RichTextEditor({ value, onChange, className }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className={cn("border rounded-md", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-3 min-h-[300px]" />
    </div>
  );
}

// ---- Tiny toolbar
import type { Editor } from "@tiptap/react";
function Toolbar({ editor }: { editor: Editor }) {
  const item = (label: string, action: () => void, isActive = false) => (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      className="px-2"
      onClick={action}
    >
      {label}
    </Button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
      {item("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
      {item("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
      {item("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
      {item("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
      {item("UL", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
      {item("OL", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
      {item("Link", () => {
        const url = prompt("URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      })}
      {item("Clear", () => editor.chain().focus().unsetAllMarks().clearNodes().run())}
    </div>
  );
}
