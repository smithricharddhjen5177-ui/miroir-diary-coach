"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useEffect } from "react"

interface Props {
  content: string
  onChange: (content: string) => void
}

export function FreeWritingEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: "开始写吧。不限格式，不限字数。哪怕只写 3 行也算完成。",
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-1",
      },
    },
    onUpdate: ({ editor }) => {
      // Save as plain text (no HTML) for markdown compatibility
      const text = editor.getText()
      onChange(text)
    },
    immediatelyRender: false,
  })

  // Sync external content changes
  useEffect(() => {
    if (editor) {
      const currentText = editor.getText()
      if (content !== currentText) {
        editor.commands.setContent(content || "")
      }
    }
  }, [content, editor])

  return (
    <div className="rounded-md border bg-background px-4 py-3">
      <EditorContent editor={editor} />
    </div>
  )
}
