import likeService from "../services/like";
import { Request, Response } from "express";
import { BaseLike, ILike } from "../models/like";
import { StatusCodes } from "http-status-codes";

const createLike = async (req: Request, res: Response) => {
  const likeData: BaseLike = {
    like: req.body.like,
    movie: req.body.movie_id,
    user: req.body.userId,
  };

  const like: ILike = await likeService.createLike(likeData);

  res.status(StatusCodes.CREATED).json(like);
};

const deleteLike = async (req: Request, res: Response) => {
  const movieId: string = req.params.movieId;
  const userId: string = req.body.userId;

  const deleteCount: number = await likeService.deleteLike(movieId, userId);

  res
    .status(StatusCodes.OK)
    .json({ message: "Deleted like.", like: deleteCount });
};

export default {
  createLike,
  deleteLike,
};
