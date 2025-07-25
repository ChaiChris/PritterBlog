export interface GetPostTypes {
  skip?: number;
  limit?: number;
  categoryId?: number;
  author?: string;
  title?: string;
  category?: string;
  status?: ArticleStatusFilter;
}

export interface GetSinglePostTypes {
  id: number;
}

export interface createPostController {
  id: number;
}

export enum ArticleStatusFilter {
  ALL = "ALL",
  PUBLISHED = "PUBLISHED",
  UNPUBLISHED = "UNPUBLISHED",
  DELETED = "DELETED",
}
