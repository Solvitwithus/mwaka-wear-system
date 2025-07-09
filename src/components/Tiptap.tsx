// components/Tiptap.tsx
'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Asterisk } from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: value,
  })

  useEffect(() => {
    if (!editor) return

    editor.on('update', () => {
      onChange(editor.getHTML())
    })
  }, [editor, onChange])

  if (!editor) return null

  const insertSpecialChar = (char: string) => {
    editor.chain().focus().insertContent(char).run()
  }

  return (
    <div className="space-y-2">
      <ToggleGroup type="multiple" className="mb-1 flex justify-end h-6">
        {/* formatting icons */}
        <ToggleGroupItem value="bold" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="bulletList" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="orderedList" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={5} />
        </ToggleGroupItem>
        <ToggleGroupItem value="special" onClick={() => insertSpecialChar('★')}>
          <Asterisk size={5} />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="rounded-md border p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
