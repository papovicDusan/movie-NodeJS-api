const Comment = require("../models/comment");
const Movie = require("../models/movie");

exports.createComment = async (content, movieId) => {
  const commentNew = new Comment({
    content: content,
    movie: movieId,
  });
  const comment = await commentNew.save();

  const movie = await Movie.findById(movieId);
  movie.comments.push(comment);
  await movie.save();

  return comment;
};

exports.getComments = async (movieId, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  const movie = await Movie.findById(movieId).populate("comments");

  results.count = movie.comments.length;

  endIndex < movie.comments.length
    ? (results.next = page + 1)
    : (results.next = null);

  startIndex > 0 ? (results.previous = page - 1) : (results.previous = null);

  const comments = movie.comments.slice(startIndex, startIndex + limit);

  return {
    count: results.count,
    next: results.next,
    previous: results.previous,
    results: comments,
  };
};

exports.getComment = async (commentId) => {
  const comment = await Comment.findById(commentId).populate("movie");
  if (!comment) {
    const error = new Error("Could not find comment.");
    error.statusCode = 404;
    throw error;
  }
  return comment;
};
