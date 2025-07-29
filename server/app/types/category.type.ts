import { ArticleStatusFilter } from "./post.type.js";

export interface GetCategoryPostTypes {
  skip?: number;
  limit?: number;
  categoryId?: number;
  status?: ArticleStatusFilter;
}
