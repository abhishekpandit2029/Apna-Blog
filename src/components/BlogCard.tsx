import React from 'react';
import { Blog } from '../context/types';
import { useBlog } from '../context/BlogContext';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  onClick: () => void;
}

export default function BlogCard({ blog, onClick }: BlogCardProps) {
  const { likeBlog } = useBlog();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeBlog(blog.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={blog.imageUrl}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
        <p className="text-gray-600 mb-4">{blog.text}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${blog.likes > 0 ? 'text-red-500' : 'text-gray-500'} hover:bg-gray-100 transition-colors`}
            onClick={handleLike}
            aria-label="Like post"
          >
            <Heart size={18} className={blog.likes > 0 ? 'fill-red-500' : ''} />
            <span>{blog.likes > 0 ? blog.likes : 'Like'}</span>
          </button>

          <button
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label="View comments"
          >
            <MessageSquare size={18} />
            <span>{blog.comments.length > 0 ? blog.comments.length : 'Comments'}</span>
          </button>

          <button
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={handleShare}
            aria-label="Share post"
          >
            <Share2 size={18} />
            <span>{blog.shares > 0 ? blog.shares : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};