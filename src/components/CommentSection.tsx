import { Comment as CommentType } from '../context/types';
import Comment from './Comment';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  comments: CommentType[];
  onAddComment: (text: string) => void;
  onAddReply: (text: string, parentCommentId: string) => void;
}

export default function CommentSection({
  comments,
  onAddComment,
  onAddReply
}: CommentSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      <div className="mb-6">
        <CommentForm onSubmit={onAddComment} />
      </div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onAddReply={onAddReply}
            />
          ))
        )}
      </div>
    </div>
  );
};