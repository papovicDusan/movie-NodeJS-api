const Movie = require("../models/movie");

exports.getMovies = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 2;
  const search = req.query.search || "";

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  Movie.find({ title: { $regex: search, $options: "i" } })
    .countDocuments()
    .then((moviesNumber) => {
      results.count = moviesNumber;

      endIndex < moviesNumber
        ? (results.next = page + 1)
        : (results.next = null);

      startIndex > 0
        ? (results.previous = page - 1)
        : (results.previous = null);

      return Movie.find({ title: { $regex: search, $options: "i" } })
        .skip(startIndex)
        .limit(limit);
    })
    .then((movies) => {
      res.status(200).json({
        count: results.count,
        next: results.next,
        previous: results.previous,
        results: movies,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createMovie = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const image_url = req.body.image_url;
  const genre = req.body.genre;
  const movie = new Movie({
    title: title,
    description: description,
    image_url: image_url,
    genre: genre,
  });
  movie
    .save()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getMovie = (req, res, next) => {
  const movieId = req.params.movieId;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        const error = new Error("Could not find movie.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(movie);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
