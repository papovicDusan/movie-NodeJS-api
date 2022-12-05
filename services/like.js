const Movie = require("../models/movie");
const Like = require("../models/like");
const User = require("../models/user");

exports.createLike = async (likeValue, movieId, userId) => {
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

  return like;
};

exports.deleteLike = async (movieId, userId) => {
  const like = await Like.findOne({ user: userId, movie: movieId });
  if (!like) {
    const error = new Error("Could not find like.");
    error.statusCode = 404;
    throw error;
  }

  const deletedLike = await Like.deleteOne({ _id: like._id });

  const user = await User.findById(userId);
  user.likes = user.likes.filter(
    (likeItem) => likeItem.toString() != like._id.toString()
  );
  await user.save();

  const movie = await Movie.findById(movieId);
  movie.likes = movie.likes.filter(
    (likeItem) => likeItem.toString() != like._id.toString()
  );
  await movie.save();

  return deletedLike;
};
