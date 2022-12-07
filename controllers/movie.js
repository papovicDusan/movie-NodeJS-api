const movieService = require("../services/movie");

exports.getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const search = req.query.search || "";
    const genre = req.query.genre || "";

    const movies = await movieService.getMovies(page, limit, search, genre);

    res.status(200).json(movies);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const imageUrl = req.body.image_url;
    const genre = req.body.genre;

    const movie = await movieService.createMovie(
      title,
      description,
      imageUrl,
      genre
    );

    res.status(201).json(movie);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.userId;

    const movie = await movieService.getMovie(movieId, userId);

    res.status(200).json(movie);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMoviesGenre = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;

    const movies = await movieService.getMoviesGenre(movieId);

    res.status(200).json(movies);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMoviesPopular = async (req, res, next) => {
  try {
    const movies = await movieService.getMoviesPopular();

    res.status(200).json(movies);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.setMovieVisits = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;

    const movie = await movieService.setMovieVisits(movieId);

    res.status(200).json(movie);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
