const commentService = require("../services/comment");

exports.createComment = async (req, res, next) => {
  try {
    const content = req.body.content;
    const movieId = req.body.movie_id;

    const comment = await commentService.createComment(content, movieId);

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

    const comments = await commentService.getComments(movieId, page, limit);

    res.status(200).json(comments);
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

    const comment = await commentService.getComment(commentId);

    res.status(200).json(comment);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
