const watchlistService = require("../services/watchlist");

exports.createWatchlist = async (req, res, next) => {
  try {
    const movieId = req.body.movie;
    const userId = req.userId;

    const watchlist = await watchlistService.createWatchlist(movieId, userId);

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
    const userId = req.userId;

    const watchlist = await watchlistService.deleteWatchlist(
      watchlistId,
      userId
    );

    res
      .status(200)
      .json({ message: "Deleted watchlist.", watchlist: watchlist });
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

    const watchlist = await watchlistService.setWatchlistWatched(
      watchlistId,
      isWatched
    );

    res.status(200).json(watchlist);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
