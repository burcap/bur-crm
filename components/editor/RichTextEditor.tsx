"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = { value: string; onChange: (html: string) => void; className?: string };

export default function RichTextEditor({ value, onChange, className }: Props) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Link.configure({ openOnClick: true }),

        // IMPORTANT: TextStyle must be BEFORE Color
        TextStyle,
        Color.configure({ types: ["textStyle"] }),

        Highlight,
        Image.configure({ HTMLAttributes: { class: "my-2" } }),
      ],
      content: value || "<p></p>",
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      immediatelyRender: false 
    }
  );

  if (!editor) return null;

  return (
    <div className={cn("border rounded-md", className)}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-3 min-h-[300px] bg-white dark:bg-background"
      />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [color, setColor] = useState("#000000");
  const fileRef = useRef<HTMLInputElement>(null);

  const Btn = (label: string, active: boolean, action: () => void) => (
    <Button type="button" variant={active ? "default" : "outline"} size="sm" className="px-2" onClick={action}>
      {label}
    </Button>
  );
    const [uploading, setUploading] = useState(false);

    async function uploadToS3(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/uploads", {
        method: "POST",
        body: fd,
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Upload failed");
    }

    const data = await res.json(); // { url: string }
    return data.url;
    }

    async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const url = await uploadToS3(file);
            editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } catch (err: any) {
            alert(err?.message ?? "Upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
      {Btn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
      {Btn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
      {Btn("H1", editor.isActive("heading", { level: 1 }), () =>
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      )}
      {Btn("H2", editor.isActive("heading", { level: 2 }), () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      )}
      {Btn("UL", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
      {Btn("OL", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
      {Btn("HL", editor.isActive("highlight"), () => editor.chain().focus().toggleHighlight().run())}

      {/* Link */}
      {Btn("Link", editor.isActive("link"), () => {
        const url = prompt("URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      })}
      {Btn("Unlink", false, () => editor.chain().focus().unsetLink().run())}

      {/* Text color */}
      <div className="flex items-center gap-2 ml-2">
        <input
          type="color"
          value={color}
          onChange={(e) => {
            const v = e.target.value;
            setColor(v);
            editor.chain().focus().setColor(v).run(); // works now that TextStyle+Color are loaded
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => editor.chain().focus().unsetColor().run()}>
          Clear Color
        </Button>
      </div>

      {/* Image */}
    <input
    ref={fileRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleImageSelect}
    />
    <Button
    type="button"
    variant="outline"
    size="sm"
    disabled={uploading}
    onClick={() => fileRef.current?.click()}
    >
        {uploading ? "Uploading…" : "Image"}
    </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ml-auto"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        Clear
      </Button>
    </div>
  );
}
