import { GetPostTypes } from "../types/post.type";
export declare const getPosts: ({ skip, limit, author, title, status, }: GetPostTypes) => Promise<({
    user: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        username: string;
        role: import(".prisma/client").$Enums.Role;
    };
} & {
    title: string;
    status: import(".prisma/client").$Enums.ArticleStatus;
    id: number;
    userId: number;
    body: string;
    createdAt: Date;
    updatedAt: Date;
})[] | undefined>;
//# sourceMappingURL=post.model.d.ts.map