const Movie = require("../models/movie");
const Like = require("../models/like");
const User = require("../models/user");

exports.createLike = async (req, res, next) => {
  try {
    const likeValue = req.body.like;
    const movieId = req.body.movie_id;
    const userId = req.userId;

    const newLike = new Like({
      like: likeValue,
      movie: movieId,
      user: userId,
    });
    const like = await newLike.save();

    const movie = await Movie.findById(movieId);
    movie.likes.push(like);
    await movie.save();

    const user = await User.findById(userId);
    user.likes.push(like);
    await user.save();

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

    const like = await Like.findOne({ user: req.userId, movie: movieId });
    if (!like) {
      const error = new Error("Could not find like.");
      error.statusCode = 404;
      throw error;
    }

    await Like.deleteOne({ _id: like._id });

    const user = await User.findById(req.userId);
    user.likes = user.likes.filter(
      (likeItem) => likeItem.toString() != like._id.toString()
    );
    await user.save();

    const movie = await Movie.findById(movieId);

    movie.likes = movie.likes.filter(
      (likeItem) => likeItem.toString() != like._id.toString()
    );
    await movie.save();

    res.status(200).json({ message: "Deleted like." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
