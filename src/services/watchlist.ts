import Watchlist, { IWatchlist, BaseWatchlist } from "../models/watchlist";
import Movie, { IMovie } from "../models/movie";
import User, { IUser } from "../models/user";
import { AppError } from "../utils/app-error";

const createWatchlist = async (
  dataWatchlist: BaseWatchlist
): Promise<IWatchlist> => {
  const newWatchlist: IWatchlist = new Watchlist({
    movie: dataWatchlist.movie,
    user: dataWatchlist.user,
  });
  const watchlist: IWatchlist = await newWatchlist.save();

  const movie: IMovie | null = await Movie.findById(dataWatchlist.movie);
  if (!movie) {
    const error: AppError = new AppError("Could not find movie.", 404);
    throw error;
  }
  movie.watchlists.push(watchlist._id);
  await movie.save();

  const user: IUser | null = await User.findById(dataWatchlist.user);
  if (!user) {
    const error: AppError = new AppError("Could not find user.", 404);
    throw error;
  }
  user.watchlists.push(watchlist._id);
  await user.save();

  return watchlist;
};

const deleteWatchlist = async (
  watchlistId: string,
  userId: string
): Promise<IWatchlist> => {
  const watchlist: IWatchlist | null = await Watchlist.findById(watchlistId);
  if (!watchlist) {
    const error: AppError = new AppError("Could not find watchlist.", 404);
    throw error;
  }

  const user: IUser | null = await User.findById(userId);
  if (!user) {
    const error: AppError = new AppError("Could not find user.", 404);
    throw error;
  }
  user.watchlists = user.watchlists.filter(
    (watchlistItem: any) => watchlistItem.toString() != watchlist._id.toString()
  );
  await user.save();

  const movie: IMovie | null = await Movie.findById(watchlist.movie);

  if (!movie) {
    const error: AppError = new AppError("Could not find movie.", 404);
    throw error;
  }
  movie.watchlists = movie.watchlists.filter(
    (watchlistItem: any) => watchlistItem.toString() != watchlist._id.toString()
  );
  await movie.save();

  const deletedWatchlst: IWatchlist = await watchlist.remove();

  return deletedWatchlst;
};

const setWatchlistWatched = async (
  watchlistId: string,
  isWatched: boolean
): Promise<IWatchlist> => {
  const watchlist: IWatchlist | null = await Watchlist.findById(watchlistId);
  if (!watchlist) {
    const error: AppError = new AppError("Could not find  watchlist.", 404);
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
