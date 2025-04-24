import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { initialBlogs } from '../data/blogData.js';
import {
  BlogState,
  BlogActionTypes,
  LIKE_BLOG,
  ADD_COMMENT,
  LOAD_MORE,
  SET_ACTIVE_BLOG,
  Comment
} from './types';

// Initial state setup
const initialState: BlogState = {
  blogs: initialBlogs.blogs,
  displayedBlogs: initialBlogs.blogs.slice(0, 20),
  currentPage: 1,
  hasMore: initialBlogs.blogs.length > 20,
  itemsPerPage: 20,
  activeBlog: null
};

// Create context
const BlogContext = createContext<{
  state: BlogState;
  likeBlog: (blogId: number) => void;
  addComment: (blogId: number, comment: Comment, parentCommentId?: string) => void;
  loadMore: () => Promise<void>;
  setActiveBlog: (blogId: number | null) => void;
}>({
  state: initialState,
  likeBlog: () => { },
  addComment: () => { },
  loadMore: async () => { },
  setActiveBlog: () => { },
});

// Reducer function
const blogReducer = (state: BlogState, action: BlogActionTypes): BlogState => {
  switch (action.type) {
    case LIKE_BLOG:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload
            ? { ...blog, likes: blog.likes + 1 }
            : blog
        ),
      };

    case ADD_COMMENT: {
      const { blogId, comment, parentCommentId } = action.payload;

      const updateComments = (comments: Comment[], parentId?: string): Comment[] => {
        if (!parentId) {
          return [...comments, comment];
        }

        return comments.map(c => {
          if (c.id === parentId) {
            return { ...c, replies: [...c.replies, comment] };
          } else if (c.replies.length > 0) {
            return { ...c, replies: updateComments(c.replies, parentId) };
          }
          return c;
        });
      };

      const updatedBlogs = state.blogs.map(blog =>
        blog.id === blogId
          ? { ...blog, comments: updateComments(blog.comments, parentCommentId) }
          : blog
      );

      return {
        ...state,
        blogs: updatedBlogs,
        displayedBlogs: state.displayedBlogs.map(blog =>
          blog.id === blogId
            ? { ...blog, comments: updateComments(blog.comments, parentCommentId) }
            : blog
        ),
        activeBlog: state.activeBlog?.id === blogId
          ? { ...state.activeBlog, comments: updateComments(state.activeBlog.comments, parentCommentId) }
          : state.activeBlog
      };
    }

    case LOAD_MORE: {
      const nextPage = state.currentPage + 1;
      const startIdx = 0;
      const endIdx = nextPage * state.itemsPerPage;
      const hasMore = endIdx < state.blogs.length;

      return {
        ...state,
        currentPage: nextPage,
        displayedBlogs: state.blogs.slice(startIdx, endIdx),
        hasMore
      };
    }

    case SET_ACTIVE_BLOG: {
      const activeBlog = action.payload
        ? state.blogs.find(blog => blog.id === action.payload) || null
        : null;

      return {
        ...state,
        activeBlog
      };
    }

    default:
      return state;
  }
};

// Provider component
export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  const likeBlog = (blogId: number) => {
    dispatch({
      type: LIKE_BLOG,
      payload: blogId
    });
  };

  const addComment = (blogId: number, comment: Comment, parentCommentId?: string) => {
    dispatch({
      type: ADD_COMMENT,
      payload: {
        blogId,
        comment,
        parentCommentId
      }
    });
  };

  const loadMore = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    dispatch({
      type: LOAD_MORE
    });
  };

  const setActiveBlog = (blogId: number | null) => {
    dispatch({
      type: SET_ACTIVE_BLOG,
      payload: blogId
    });
  };

  return (
    <BlogContext.Provider value={{
      state,
      likeBlog,
      addComment,
      loadMore,
      setActiveBlog,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook for using the blog context
export const useBlog = () => {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }

  return context;
};