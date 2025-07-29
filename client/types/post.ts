export interface PostCard {
  id: number;
  title: string;
  content: string;
  photoUrl?: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

export type PostListProps = {
  posts: PostCard[];
};

export type PostCardProps = {
  post: PostCard;
};
