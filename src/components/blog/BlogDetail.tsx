import { useBlog } from "../../context/BlogContext";
import { X } from "lucide-react";
import CommentSection from "../comment/CommentSection";
import { Comment } from "../../context/types";

export default function BlogDetail() {
  const { state, setActiveBlog, addComment } = useBlog();
  const { activeBlog } = state;

  if (!activeBlog) {
    return null;
  }

  const handleClose = () => {
    setActiveBlog(null);
  };

  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author: "User",
      timestamp: new Date(),
      replies: [],
    };

    addComment(activeBlog.id, newComment);
  };

  const handleAddReply = (text: string, parentCommentId: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      text,
      author: "User",
      timestamp: new Date(),
      replies: [],
    };

    addComment(activeBlog.id, newReply, parentCommentId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto py-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
          onClick={handleClose}
        >
          <X size={24} />
        </button>

        <div>
          <img
            src={activeBlog.imageUrl}
            alt={activeBlog.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {activeBlog.title}
            </h1>
            <p className="text-gray-700 mb-6">{activeBlog.text}</p>

            <CommentSection
              comments={activeBlog.comments}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
