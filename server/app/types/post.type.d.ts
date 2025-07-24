export interface GetPostTypes {
    skip?: number;
    limit?: number;
    author?: string;
    title?: string;
    status?: ArticleStatusFilter;
}
export declare enum ArticleStatusFilter {
    ALL = "ALL",
    PUBLISHED = "PUBLISHED",
    UNPUBLISHED = "UNPUBLISHED",
    DELETED = "DELETED"
}
//# sourceMappingURL=post.type.d.ts.map