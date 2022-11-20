const Comment = require("../models/comment");
const Movie = require("../models/movie");

exports.createComment = async (req, res, next) => {
  try {
    const content = req.body.content;
    const movieId = req.body.movie_id;

    const commentNew = new Comment({
      content: content,
      movie: movieId,
    });
    const comment = await commentNew.save();

    const movie = await Movie.findById(movieId);
    movie.comments.push(comment);
    await movie.save();

    res.status(201).json(comment);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const page = parseInt(req.query.page) || 1;
    const limit = 2;

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

    res.status(200).json({
      count: results.count,
      next: results.next,
      previous: results.previous,
      results: comments,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId).populate("movie");

    if (!comment) {
      const error = new Error("Could not find comment.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(comment);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
