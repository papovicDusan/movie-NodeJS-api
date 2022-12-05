const Watchlist = require("../models/watchlist");
const Movie = require("../models/movie");
const User = require("../models/user");

exports.createWatchlist = async (movieId, userId) => {
  const newWatchlist = new Watchlist({
    movie: movieId,
    user: userId,
  });
  const watchlist = await newWatchlist.save();

  const movie = await Movie.findById(movieId);
  movie.watchlists.push(watchlist);
  await movie.save();

  const user = await User.findById(userId);
  user.watchlists.push(watchlist);
  await user.save();

  return watchlist;
};

exports.deleteWatchlist = async (watchlistId, userId) => {
  const watchlist = await Watchlist.findById(watchlistId);
  if (!watchlist) {
    const error = new Error("Could not find watchlist.");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId);
  user.watchlists = user.watchlists.filter(
    (watchlistItem) => watchlistItem.toString() != watchlist._id.toString()
  );
  await user.save();

  const movie = await Movie.findById(watchlist.movie);
  movie.watchlists = movie.watchlists.filter(
    (watchlistItem) => watchlistItem.toString() != watchlist._id.toString()
  );
  await movie.save();

  const deletedWatchlst = await watchlist.remove();

  return deletedWatchlst;
};

exports.setWatchlistWatched = async (watchlistId, isWatched) => {
  const watchlist = await Watchlist.findById(watchlistId);
  watchlist.is_watched = isWatched;
  await watchlist.save();

  return watchlist;
};
