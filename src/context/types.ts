// Action Types
export const LIKE_BLOG = "LIKE_BLOG";
export const ADD_COMMENT = "ADD_COMMENT";
export const LOAD_MORE = "LOAD_MORE";
export const SET_ACTIVE_BLOG = "SET_ACTIVE_BLOG";
export const INCREMENT_SHARES = "INCREMENT_SHARES";

// Type Definitions
export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  replies: Comment[];
}

export interface Blog {
  id: number;
  title: string;
  text: string;
  imageUrl: string;
  likes: number;
  likedByMe: boolean;
  comments: Comment[];
  shares: number;
}

export interface BlogState {
  blogs: Blog[];
  displayedBlogs: Blog[];
  currentPage: number;
  hasMore: boolean;
  itemsPerPage: number;
  activeBlog: Blog | null;
}

// Action Interfaces
export interface LikeBlogAction {
  type: typeof LIKE_BLOG;
  payload: number; // Blog ID
}

export interface AddCommentAction {
  type: typeof ADD_COMMENT;
  payload: {
    blogId: number;
    comment: Comment;
    parentCommentId?: string;
  };
}

export interface LoadMoreAction {
  type: typeof LOAD_MORE;
}

export interface SetActiveBlogAction {
  type: typeof SET_ACTIVE_BLOG;
  payload: number | null; // Blog ID or null
}

export type BlogActionTypes =
  | LikeBlogAction
  | AddCommentAction
  | LoadMoreAction
  | SetActiveBlogAction;
