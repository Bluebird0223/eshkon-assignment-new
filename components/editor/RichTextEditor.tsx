'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
    content: any;
    onChange?: (content: any) => void;
    editable?: boolean;
}

export default function RichTextEditor({ content, onChange, editable = true }: Props) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing something amazing...',
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getJSON());
            }
        },
    });

    if (!editor) return null;

    const toolbarButtonClass = (active: boolean) =>
        `p-2 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`;

    return (
        <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
            {editable && (
                <div className="border-b bg-gray-50/50 p-2 flex flex-wrap gap-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={toolbarButtonClass(editor.isActive('bold'))}
                        title="Bold"
                    >
                        <span className="font-bold">B</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={toolbarButtonClass(editor.isActive('italic'))}
                        title="Italic"
                    >
                        <span className="italic">I</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={toolbarButtonClass(editor.isActive('heading', { level: 1 }))}
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={toolbarButtonClass(editor.isActive('bulletList'))}
                        title="Bullet List"
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={toolbarButtonClass(editor.isActive('orderedList'))}
                        title="Ordered List"
                    >
                        1. List
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={toolbarButtonClass(editor.isActive('codeBlock'))}
                        title="Code Block"
                    >
                        &lt;/&gt;
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={toolbarButtonClass(editor.isActive('blockquote'))}
                        title="Blockquote"
                    >
                        &quot;
                    </button>
                </div>
            )}
            <div className="p-4 min-h-[400px] prose prose-blue max-w-none">
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                 .tiptap {
    color: #000;
    caret-color: #000;
  }

  .tiptap p.is-editor-empty:first-child::before {
    color: #2b2b2bff;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  .tiptap:focus {
    outline: none;
  }
            `}</style>
        </div>
    );
}