const likeService = require("../services/like");

exports.createLike = async (req, res, next) => {
  try {
    const likeValue = req.body.like;
    const movieId = req.body.movie_id;
    const userId = req.userId;

    const like = await likeService.createLike(likeValue, movieId, userId);

    res.status(201).json(like);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.userId;

    const like = await likeService.deleteLike(movieId, userId);

    res.status(200).json({ message: "Deleted like.", like: like });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
