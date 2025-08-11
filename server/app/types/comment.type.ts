export interface User {
  id: number;
  username: string;
  avatarPath: string | null;
}

export interface Comment {
  id: number;
  userId: number | null;
  postId: number;
  body: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  user: User | null;
}

export interface CommentResponse {
  comments: Comment[];
  nextCursor?: string | null;
  total?: number;
}

export interface getCommentsResponse {
  comments: Comment[];
  nextCursor?: string | null;
  total?: number;
}

export interface CreateCommentInput {
  postId: number;
  limit?: number;
  body: string;
  userId?: number;
}

export type CommentStatus = "PUBLISHED" | "PENDING" | "DELETED";
