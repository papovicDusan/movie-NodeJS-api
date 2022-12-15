import Watchlist, { IWatchlist, BaseWatchlist } from "../models/watchlist";
import Movie, { IMovie } from "../models/movie";
import User, { IUser } from "../models/user";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

const createWatchlist = async (
  dataWatchlist: BaseWatchlist
): Promise<IWatchlist> => {
  const newWatchlist: IWatchlist = new Watchlist({
    movie: dataWatchlist.movie,
    user: dataWatchlist.user,
  });
  const watchlist: IWatchlist = await newWatchlist.save();

  const movie: IMovie | null = await Movie.findOneAndUpdate(
    { _id: dataWatchlist.movie },
    { $push: { watchlists: watchlist._id } },
    { new: true }
  );
  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const user: IUser | null = await User.findOneAndUpdate(
    { _id: dataWatchlist.user },
    { $push: { watchlists: watchlist._id } },
    { new: true }
  );
  if (!user) {
    const error: AppError = new AppError(
      "Could not find user.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  return watchlist;
};

const deleteWatchlist = async (
  watchlistId: string,
  userId: string
): Promise<IWatchlist> => {
  const watchlist: IWatchlist | null = await Watchlist.findById(watchlistId);
  if (!watchlist) {
    const error: AppError = new AppError(
      "Could not find watchlist.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const user: IUser | null = await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { watchlists: watchlist._id } },
    { new: true }
  );

  if (!user) {
    const error: AppError = new AppError(
      "Could not find user.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const movie: IMovie | null = await Movie.findOneAndUpdate(
    { _id: watchlist.movie },
    { $pull: { watchlists: watchlist._id } },
    { new: true }
  );

  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const deletedWatchlst: IWatchlist = await watchlist.remove();

  return deletedWatchlst;
};

const setWatchlistWatched = async (
  watchlistId: string,
  isWatched: boolean
): Promise<IWatchlist> => {
  const watchlist: IWatchlist | null = await Watchlist.findById(watchlistId);
  if (!watchlist) {
    const error: AppError = new AppError(
      "Could not find  watchlist.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }
  watchlist.is_watched = isWatched;
  await watchlist.save();

  return watchlist;
};

export default {
  createWatchlist,
  deleteWatchlist,
  setWatchlistWatched,
};
