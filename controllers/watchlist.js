const Watchlist = require("../models/watchlist");
const Movie = require("../models/movie");
const User = require("../models/user");
var mongoose = require("mongoose");

exports.createWatchlist = async (req, res, next) => {
  try {
    const movieId = req.body.movie;
    const userId = req.userId;

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

    res.status(201).json(watchlist);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteWatchlist = async (req, res, next) => {
  try {
    const watchlistId = req.params.watchlistId;

    const watchlist = await Watchlist.findById(watchlistId);

    if (!watchlist) {
      const error = new Error("Could not find watchlist.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    user.watchlists = user.watchlists.filter(
      (watchlistItem) => watchlistItem.toString() != watchlist._id.toString()
    );
    await user.save();

    const movie = await Movie.findById(watchlist.movie);
    movie.watchlists = movie.watchlists.filter(
      (watchlistItem) => watchlistItem.toString() != watchlist._id.toString()
    );
    await movie.save();

    await watchlist.remove();

    res.status(200).json({ message: "Deleted watchlist." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.setWatchlistWatched = async (req, res, next) => {
  try {
    const watchlistId = req.params.watchlistId;
    const isWatched = req.body.is_watched;
    const watchlist = await Watchlist.findById(watchlistId);
    watchlist.is_watched = isWatched;
    await watchlist.save();

    res.status(200).json(watchlist);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
