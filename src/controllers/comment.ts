import commentService from "../services/comment";
import { NextFunction, Request, Response } from "express";
import log from "../logger";
import { BaseComment, IComment, ICommentPaginate } from "../models/comment";

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentData: BaseComment = {
      content: req.body.content,
      movie: req.body.movie_id,
    };

    const comment: IComment = await commentService.createComment(commentData);

    res.status(201).json(comment);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movieId: string = req.params.movieId;
    const page: number = Number(req.query.page) || 1;
    const limit: number = 2;

    const comments: ICommentPaginate = await commentService.getComments(
      movieId,
      page,
      limit
    );

    res.status(200).json(comments);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export default { createComment, getComments };
