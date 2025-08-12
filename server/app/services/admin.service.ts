import { client as prisma } from "../prisma/client.js";

interface CreatePostData {
  title: string;
  body: string;
  bodyJson: any;
  categoryId: number;
  userId: number;
  coverImagePath: string;
}

interface UpdatePostData {
  title?: string;
  body?: string;
  categoryId?: number;
  coverImagePath?: string;
}

export class PostAdminService {
  async createPost(data: CreatePostData) {
    return prisma.post.create({
      data: {
        title: data.title,
        body: data.body,
        bodyJson: data.bodyJson,
        categoryId: data.categoryId,
        userId: data.userId,
        coverImagePath: data.coverImagePath,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }
  async updatePost(id: number, data: UpdatePostData) {
    return prisma.post.update({
      where: {id},
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        category: true,
      },
    });
  }
  async updateCoverImage(postId: number, coverImagePath: string) {
    return prisma.post.update({
      where: {id: postId},
      data: {
        coverImagePath,
        updatedAt: new Date(),
      },
    });
  }
  async deletePost(id: number) {
    return prisma.post.delete({
      where: {id},
    });
  }
}
