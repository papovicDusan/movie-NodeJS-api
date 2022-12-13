import watchlistService from "../services/watchlist";
import { NextFunction, Request, Response } from "express";
import log from "../logger";
import { BaseWatchlist, IWatchlist } from "../models/watchlist";

const createWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const watchlistData: BaseWatchlist = {
      movie: req.body.movie,
      user: req.body.userId,
    };

    const watchlist: IWatchlist = await watchlistService.createWatchlist(
      watchlistData
    );

    res.status(201).json(watchlist);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deleteWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const watchlistId: string = req.params.watchlistId;
    const userId: string = req.body.userId;

    const watchlist: IWatchlist = await watchlistService.deleteWatchlist(
      watchlistId,
      userId
    );

    res
      .status(200)
      .json({ message: "Deleted watchlist.", watchlist: watchlist });
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const setWatchlistWatched = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const watchlistId: string = req.params.watchlistId;
    const isWatched: boolean = req.body.is_watched;

    const watchlist: IWatchlist = await watchlistService.setWatchlistWatched(
      watchlistId,
      isWatched
    );

    res.status(200).json(watchlist);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export default {
  createWatchlist,
  deleteWatchlist,
  setWatchlistWatched,
};
