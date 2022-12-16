import commentService from "../services/comment";
import { Request, Response } from "express";
import { BaseComment, IComment, ICommentPaginate } from "../models/comment";
import { StatusCodes } from "http-status-codes";

const createComment = async (req: Request, res: Response) => {
  const commentData: BaseComment = {
    content: req.body.content,
    movie: req.body.movie_id,
  };

  const comment: IComment = await commentService.createComment(commentData);

  res.status(StatusCodes.CREATED).json(comment);
};

const getComments = async (req: Request, res: Response) => {
  const movieId: string = req.params.movieId;
  const page: number = Number(req.query.page) || 1;
  const limit: number = 2;

  const comments: ICommentPaginate = await commentService.getComments(
    movieId,
    page,
    limit
  );

  res.status(StatusCodes.OK).json(comments);
};

export default { createComment, getComments };
