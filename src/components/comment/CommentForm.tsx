import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export default function CommentForm({
  onSubmit,
  placeholder = 'Add a comment...'
}: CommentFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <p
          className="text-basis rounded-md border-gray-300 bg-gray-100 px-2 py-1"
        >User</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
          placeholder={placeholder}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-indigo-600 text-white px-3 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};