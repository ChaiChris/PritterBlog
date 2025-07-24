import { Request, Response } from "express";
import * as postService from "../models/post.model.js";
import {
  GetPostTypes,
  GetSinglePostTypes,
  ArticleStatusFilter,
} from "../types/post.type.js";
import { logger } from "../logger.js";
import { getSinglePost } from "../models/post.model.js";

export const getPostsController = async (req: Request, res: Response) => {
  const { limit, skip, author, title, status } = req.query;
  const isValidStatus = (val: any): val is ArticleStatusFilter =>
    ["ALL", "PUBLISHED", "UNPUBLISHED", "DELETED"].includes(val);

  const query: GetPostTypes = {
    limit: Number(limit) || 10,
    skip: Number(skip) || 0,
    author: author ? (author as string) : undefined,
    title: title ? (title as string) : undefined,
    status: isValidStatus(status) ? status : undefined,
  };

  try {
    const posts = await postService.getPosts(query);
    logger.info("getPostsController: GetPosts Successfully");
    res.status(200).json(posts);
  } catch (err: any) {
    logger.error(`getPostsController: ERROR ${err.message}`);
    res.status(400).json({ error: "posts fetch error" });
  }
};

export const getSinglePostController = async (req: Request, res: Response) => {
  const { id } = req.query;
  const query: GetSinglePostTypes = {
    id: Number(id),
  };

  try {
    const posts = await postService.getSinglePost(query);
    logger.info("getSinglePostController: GetSinglePost Successfully");
    res.status(200).json(posts);
  } catch (err: any) {
    logger.error(`getSinglePostController: ERROR ${err.message}`);
    res.status(400).json({ error: "post fetch error" });
  }
};
