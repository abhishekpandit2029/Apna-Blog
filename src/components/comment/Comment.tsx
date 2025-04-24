import { useState } from "react";
import { Comment as CommentType } from "../../context/types";
import { Reply } from "lucide-react";
import CommentForm from "./CommentForm";

interface CommentProps {
  comment: CommentType;
  onAddReply: (text: string, parentCommentId: string) => void;
  level?: number;
}

export default function Comment({
  comment,
  onAddReply,
  level = 0,
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const maxLevel = 3;

  const handleReply = (text: string) => {
    onAddReply(text, comment.id);
    setIsReplying(false);
  };

  const formattedDate = new Date(comment.timestamp).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      className={`border-l-2 pl-4 ${
        level === 0
          ? "border-indigo-500"
          : level === 1
          ? "border-blue-400"
          : level === 2
          ? "border-teal-400"
          : "border-gray-300"
      } mb-4`}
    >
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-semibold">
            {comment.author.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">{comment.author}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        <p className="text-gray-700 pl-10">{comment.text}</p>

        <div className="flex mt-2 pl-10 space-x-4">
          {level < maxLevel && (
            <button
              className="text-gray-500 text-xs flex items-center gap-1 hover:text-gray-700"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply size={14} />
              <span>{isReplying ? "Cancel" : "Reply"}</span>
            </button>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="pl-10 mb-3">
          <CommentForm onSubmit={handleReply} placeholder="Write a reply..." />
        </div>
      )}

      {comment.replies.length > 0 && level < maxLevel && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {comment.replies.length > 0 && level >= maxLevel && (
        <div className="text-xs text-gray-500 mt-1 pl-10">
          {comment.replies.length} more{" "}
          {comment.replies.length === 1 ? "reply" : "replies"}
        </div>
      )}
    </div>
  );
}
