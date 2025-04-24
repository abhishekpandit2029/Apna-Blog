import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
// @ts-expect-error: JS file doesn't have type exports, but we know its structure is valid
import { initialBlogs } from "../data/blogData.js";
import { BlogState, Comment } from "./types.js";

const initState: BlogState = {
  blogs: initialBlogs.blogs,
  displayedBlogs: initialBlogs.blogs.slice(0, 20),
  currentPage: 1,
  hasMore: initialBlogs.blogs.length > 20,
  itemsPerPage: 20,
  activeBlog: null,
};

const BlogContext = createContext<{
  state: BlogState;
  likeBlog: (blogId: number) => void;
  addComment: (
    blogId: number,
    comment: Comment,
    parentCommentId?: string
  ) => void;
  loadMore: () => Promise<void>;
  setActiveBlog: (blogId: number | null) => void;
}>({
  state: initState,
  likeBlog: () => { },
  addComment: () => { },
  loadMore: async () => { },
  setActiveBlog: () => { },
});

export const BlogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<BlogState>(initState);

  const likeBlog = useCallback((blogId: number) => {
    setState((prev) => {
      const toggle = (blogs: typeof prev.blogs) =>
        blogs.map((b) =>
          b.id === blogId
            ? {
              ...b,
              likes: b.likedByMe ? b.likes - 1 : b.likes + 1,
              likedByMe: !b.likedByMe,
            }
            : b
        );

      return {
        ...prev,
        blogs: toggle(prev.blogs),
        displayedBlogs: toggle(prev.displayedBlogs),
        activeBlog:
          prev.activeBlog?.id === blogId
            ? {
              ...prev.activeBlog,
              likes: prev.activeBlog.likedByMe
                ? prev.activeBlog.likes - 1
                : prev.activeBlog.likes + 1,
              likedByMe: !prev.activeBlog.likedByMe,
            }
            : prev.activeBlog,
      };
    });
  }, []);

  const addComment = useCallback(
    (blogId: number, comment: Comment, parentCommentId?: string) => {
      /* recursive helper to insert comment */
      const insert = (comments: Comment[]): Comment[] => {
        if (!parentCommentId) return [...comments, comment];

        return comments.map((c) => {
          if (c.id === parentCommentId) {
            return { ...c, replies: [...c.replies, comment] };
          }
          if (c.replies.length) {
            return { ...c, replies: insert(c.replies) };
          }
          return c;
        });
      };

      setState((prev) => {
        const patch = (blogs: typeof prev.blogs) =>
          blogs.map((b) =>
            b.id === blogId ? { ...b, comments: insert(b.comments) } : b
          );

        return {
          ...prev,
          blogs: patch(prev.blogs),
          displayedBlogs: patch(prev.displayedBlogs),
          activeBlog:
            prev.activeBlog?.id === blogId
              ? {
                ...prev.activeBlog,
                comments: insert(prev.activeBlog.comments),
              }
              : prev.activeBlog,
        };
      });
    },
    []
  );

  const loadMore = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));

    setState((prev) => {
      const nextPage = prev.currentPage + 1;
      const endIdx = nextPage * prev.itemsPerPage;
      return {
        ...prev,
        currentPage: nextPage,
        displayedBlogs: prev.blogs.slice(0, endIdx),
        hasMore: endIdx < prev.blogs.length,
      };
    });
  }, []);

  const setActiveBlog = useCallback((blogId: number | null) => {
    setState((prev) => ({
      ...prev,
      activeBlog: blogId
        ? prev.blogs.find((b) => b.id === blogId) || null
        : null,
    }));
  }, []);

  return (
    <BlogContext.Provider
      value={{ state, likeBlog, addComment, loadMore, setActiveBlog }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within BlogProvider");
  return ctx;
};
