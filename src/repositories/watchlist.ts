import Watchlist, { IWatchlist, BaseWatchlist } from "../models/watchlist";

const createWatchlist = async (
  dataWatchlist: BaseWatchlist
): Promise<IWatchlist> => {
  const watchlist: IWatchlist = new Watchlist({
    movie: dataWatchlist.movie,
    user: dataWatchlist.user,
  });
  return await watchlist.save();
};

const findWatchlist = async (
  watchlistId: string
): Promise<IWatchlist | null> => {
  return await Watchlist.findById(watchlistId);
};

const deleteWatchlist = async (watchlist: IWatchlist): Promise<IWatchlist> => {
  return await watchlist.remove();
};

const updateWatchlistIsWatched = async (
  watchlist: IWatchlist,
  isWatched: boolean
): Promise<IWatchlist> => {
  watchlist.is_watched = isWatched;
  return await watchlist.save();
};

export default {
  createWatchlist,
  findWatchlist,
  deleteWatchlist,
  updateWatchlistIsWatched,
};
