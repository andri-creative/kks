import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    FiBold,
    FiItalic,
    FiList,
    FiRotateCcw,
    FiRotateCw,
    FiTrash2
} from 'react-icons/fi';

interface TiptapEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange, placeholder = 'Tulis di sini...' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, // Keep it streamlined to simple formatted lists & text
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-xs focus:outline-none min-h-[120px] max-h-[180px] overflow-y-auto px-4 py-3 text-xs text-gray-700 leading-relaxed [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5',
                placeholder,
            },
        },
    });

    // Keep editor content in sync when value changes programmatically (e.g. edit mode initial load)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="border border-gray-250 rounded-lg overflow-hidden bg-white focus-within:border-text-green focus-within:ring-1 focus-within:ring-text-green transition-all">
            {/* Toolbar Header */}
            <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-150 px-3 py-1.5 flex-wrap">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-lg text-gray-500 hover:text-text-green hover:bg-emerald-50 transition-colors cursor-pointer ${editor.isActive('bold') ? 'bg-emerald-50 text-text-green font-bold' : ''}`}
                    title="Tebalkan (Bold)"
                >
                    <FiBold className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-lg text-gray-500 hover:text-text-green hover:bg-emerald-50 transition-colors cursor-pointer ${editor.isActive('italic') ? 'bg-emerald-50 text-text-green font-bold' : ''}`}
                    title="Miringkan (Italic)"
                >
                    <FiItalic className="size-3.5" />
                </button>

                <div className="w-px h-4 bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-lg text-gray-500 hover:text-text-green hover:bg-emerald-50 transition-colors cursor-pointer ${editor.isActive('bulletList') ? 'bg-emerald-50 text-text-green font-bold' : ''}`}
                    title="Daftar Bulatan (Bullet List)"
                >
                    <FiList className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-lg text-gray-500 hover:text-text-green hover:bg-emerald-50 transition-colors cursor-pointer ${editor.isActive('orderedList') ? 'bg-emerald-50 text-text-green font-bold' : ''}`}
                    title="Daftar Angka (Ordered List)"
                >
                    {/* Clean SVG icon for numbers list */}
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9v-.9H2v1zm5-6v2h14V5H7zm0 7h14v-2H7v2zm0 5h14v-2H7v2z" />
                    </svg>
                </button>

                <div className="w-px h-4 bg-gray-300 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-text-green hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Undo"
                >
                    <FiRotateCcw className="size-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-text-green hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Redo"
                >
                    <FiRotateCw className="size-3.5" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().clearContent().run()}
                    className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Bersihkan Semua"
                >
                    <FiTrash2 className="size-3.5" />
                </button>
            </div>

            {/* Rich Text Editor Input Field */}
            <div className="tiptap-editor-content">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
