import watchlistService from "../services/watchlist";
import { NextFunction, Request, Response } from "express";
import { BaseWatchlist, IWatchlist } from "../models/watchlist";
import { StatusCodes } from "http-status-codes";

const createWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const watchlistData: BaseWatchlist = {
    movie: req.body.movie,
    user: req.body.userId,
  };

  const watchlist: IWatchlist = await watchlistService.createWatchlist(
    watchlistData
  );

  res.status(StatusCodes.CREATED).json(watchlist);
};

const deleteWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const watchlistId: string = req.params.watchlistId;
  const userId: string = req.body.userId;

  const watchlist: IWatchlist = await watchlistService.deleteWatchlist(
    watchlistId,
    userId
  );

  res
    .status(StatusCodes.OK)
    .json({ message: "Deleted watchlist.", watchlist: watchlist });
};

const setWatchlistWatched = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const watchlistId: string = req.params.watchlistId;
  const isWatched: boolean = req.body.is_watched;

  const watchlist: IWatchlist = await watchlistService.setWatchlistWatched(
    watchlistId,
    isWatched
  );

  res.status(StatusCodes.OK).json(watchlist);
};

export default {
  createWatchlist,
  deleteWatchlist,
  setWatchlistWatched,
};
