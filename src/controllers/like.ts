import likeService from "../services/like";
import { NextFunction, Request, Response } from "express";
import log from "../logger";
import { BaseLike, ILike } from "../models/like";

const createLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const likeData: BaseLike = {
      like: req.body.like,
      movie: req.body.movie_id,
      user: req.body.userId,
    };

    const like: ILike = await likeService.createLike(likeData);

    res.status(201).json(like);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movieId: string = req.params.movieId;
    const userId: string = req.body.userId;

    const deleteCount: number = await likeService.deleteLike(movieId, userId);

    res.status(200).json({ message: "Deleted like.", like: deleteCount });
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export default {
  createLike,
  deleteLike,
};
