export interface User {
  id?: number;
  username?: string;
  avatarPath?: string;
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
  isAuthor: boolean;
}

export interface CommentResponse {
  comments: Comment[];
  nextCursor?: string | null;
  total?: number;
}

export type CommentStatus = "PUBLISHED" | "PENDING" | "DELETED";
