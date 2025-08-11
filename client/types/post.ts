export interface PostCard {
  id: number;
  title: string;
  body: string;
  bodyText: string;
  coverImagePath: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    avatarPath?: string;
  };
}

export type PostCardProps = {
  post: PostCard;
};

export interface GetSinglePostTypes {
  id: number;
  title: string;
  body: string;
  bodyJson: Record<string, unknown>;
  coverImagePath: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    avatarPath?: string;
  };
}

export interface PostsResponse {
  posts: PostCard[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface UsePostsParams {
  limit?: number;
  categoryId?: number;
  author?: string;
  title?: string;
  status?: string;
  initialData?: PostsResponse;
}
