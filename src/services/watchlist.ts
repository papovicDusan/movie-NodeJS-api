import { IWatchlist, BaseWatchlist } from "../models/watchlist";
import { IMovie } from "../models/movie";
import { IUser } from "../models/user";
import { NotFoundError } from "../utils/app-error";
import watchlistRepo from "../repositories/watchlist";
import movieRepo from "../repositories/movie";
import userRepo from "../repositories/user";

const createWatchlist = async (
  dataWatchlist: BaseWatchlist
): Promise<IWatchlist> => {
  const watchlist: IWatchlist = await watchlistRepo.createWatchlist(
    dataWatchlist
  );

  const movie: IMovie | null = await movieRepo.findMovieAndUpdateWatchlistsAdd(
    dataWatchlist.movie,
    watchlist._id
  );

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }

  const user: IUser | null = await userRepo.findUserAndUpdateWatchlistsAdd(
    dataWatchlist.user,
    watchlist._id
  );

  if (!user) {
    const error: NotFoundError = new NotFoundError("Could not find user.");
    throw error;
  }

  return watchlist;
};

const deleteWatchlist = async (
  watchlistId: string,
  userId: string
): Promise<IWatchlist> => {
  const watchlist: IWatchlist | null = await watchlistRepo.findWatchlist(
    watchlistId
  );

  if (!watchlist) {
    const error: NotFoundError = new NotFoundError("Could not find watchlist.");
    throw error;
  }

  const user: IUser | null = await userRepo.findUserAndUpdateWatchlistsDelete(
    userId,
    watchlist._id
  );

  if (!user) {
    const error: NotFoundError = new NotFoundError("Could not find user.");
    throw error;
  }

  const movie: IMovie | null =
    await movieRepo.findMovieAndUpdateWatchlistsDelete(
      watchlist.movie,
      watchlist._id
    );

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }

  const deletedWatchlist: IWatchlist = await watchlistRepo.deleteWatchlist(
    watchlist
  );

  return deletedWatchlist;
};

const setWatchlistWatched = async (
  watchlistId: string,
  isWatched: boolean
): Promise<IWatchlist> => {
  const watchlist: IWatchlist | null = await watchlistRepo.findWatchlist(
    watchlistId
  );

  if (!watchlist) {
    const error: NotFoundError = new NotFoundError("Could not find watchlist.");
    throw error;
  }

  const updateWatchlist: IWatchlist =
    await watchlistRepo.updateWatchlistIsWatched(watchlist, isWatched);

  return updateWatchlist;
};

export default {
  createWatchlist,
  deleteWatchlist,
  setWatchlistWatched,
};
