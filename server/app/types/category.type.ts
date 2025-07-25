import { ArticleStatusFilter } from "./post.type";

export interface GetCategoryPostTypes {
  skip?: number;
  limit?: number;
  categoryId?: number;
  status?: ArticleStatusFilter;
}
