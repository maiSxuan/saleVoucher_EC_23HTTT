import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 bg-gray-50 border border-b-0 rounded-t-xl px-3 py-2 border-gray-200">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded text-xs font-bold transition-colors ${
          editor.isActive('bold') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="In đậm (Bold)"
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded text-xs italic transition-colors ${
          editor.isActive('italic') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="In nghiêng (Italic)"
      >
        <Italic size={14} />
      </button>
      <span className="w-px h-4 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded text-xs font-semibold transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="Tiêu đề 1"
      >
        <Heading1 size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded text-xs font-semibold transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="Tiêu đề 2"
      >
        <Heading2 size={14} />
      </button>
      <span className="w-px h-4 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded text-xs transition-colors ${
          editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="Danh sách dấu chấm"
      >
        <List size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded text-xs transition-colors ${
          editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="Danh sách số"
      >
        <ListOrdered size={14} />
      </button>
      <span className="w-px h-4 bg-gray-300 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded text-xs transition-colors ${
          editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'hover:bg-gray-200 text-gray-700'
        }`}
        title="Trích dẫn"
      >
        <Quote size={14} />
      </button>
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-30"
          title="Hoàn tác (Undo)"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-30"
          title="Làm lại (Redo)"
        >
          <Redo size={14} />
        </button>
      </div>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-3.5 min-h-[220px] max-h-[400px] overflow-y-auto border border-gray-200 rounded-b-xl bg-white focus-within:ring-2 focus-within:ring-blue-100 text-sm outline-none"
      />
    </div>
  );
}
