const Comment = require("../models/comment");
const Movie = require("../models/movie");

exports.createComment = (req, res, next) => {
  const content = req.body.content;
  const movie_id = req.body.movie_id;

  const comment = new Comment({
    content: content,
    movie: movie_id,
  });
  comment
    .save()
    .then((comment) => {
      return Movie.findById(movie_id);
    })
    .then((movie) => {
      movie.comments.push(comment);
      return movie.save();
    })
    .then((movie) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getComment = (req, res, next) => {
  const commentId = req.params.commentId;
  Comment.findById(commentId)
    .populate("movie")
    .then((comment) => {
      if (!comment) {
        const error = new Error("Could not find comment.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(comment);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
