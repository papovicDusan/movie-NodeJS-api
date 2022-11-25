const Movie = require("../models/movie");
const Like = require("../models/like");
var mongoose = require("mongoose");

exports.getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 2;
    const search = req.query.search || "";
    const genre = req.query.genre || "";
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (genre) {
      query.genre = genre;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    const moviesNumber = await Movie.find(query).countDocuments();

    results.count = moviesNumber;
    endIndex < moviesNumber ? (results.next = page + 1) : (results.next = null);
    startIndex > 0 ? (results.previous = page - 1) : (results.previous = null);

    const movies = await Movie.find(query).skip(startIndex).limit(limit);

    const moviesLikesDislikes = await Promise.all(
      movies.map(async (movie) => {
        let likes = null;
        let dislikes = null;
        let movieLikesDislikes = {};

        const likesDisLikeNumber = await Like.aggregate([
          {
            $match: {
              movie: mongoose.Types.ObjectId(movie._id),
            },
          },
          {
            $group: {
              _id: "$like",
              numberLikesOrDislikes: { $sum: 1 },
            },
          },
        ]);

        likesDisLikeNumber.map((likeItem) => {
          if (likeItem._id == 1) {
            likes = likeItem.numberLikesOrDislikes;
          }
          if (likeItem._id == -1) {
            dislikes = likeItem.numberLikesOrDislikes;
          }
        });

        movieLikesDislikes = movie._doc;
        movieLikesDislikes.numberOfLikes = likes;
        movieLikesDislikes.numberOfDislikes = dislikes;
        return movieLikesDislikes;
      })
    );

    res.status(200).json({
      count: results.count,
      next: results.next,
      previous: results.previous,
      results: moviesLikesDislikes,
    });
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
    const movieNew = new Movie({
      title: title,
      description: description,
      image_url: imageUrl,
      genre: genre,
    });
    const movie = await movieNew.save();

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
    let likes = null;
    let dislikes = null;
    let userLikeOrDislike = null;
    let movieLikesDislikes = {};

    const movie = await Movie.findById(movieId);

    if (!movie) {
      const error = new Error("Could not find movie.");
      error.statusCode = 404;
      throw error;
    }

    const likesDisLikeNumber = await Like.aggregate([
      {
        $match: {
          movie: mongoose.Types.ObjectId(movie._id),
        },
      },
      {
        $group: {
          _id: "$like",
          numberLikesOrDislikes: { $sum: 1 },
        },
      },
    ]);

    likesDisLikeNumber.map((likeItem) => {
      if (likeItem._id == 1) {
        likes = likeItem.numberLikesOrDislikes;
      }
      if (likeItem._id == -1) {
        dislikes = likeItem.numberLikesOrDislikes;
      }
    });

    const likeOrDislike = await Like.aggregate([
      {
        $match: {
          movie: mongoose.Types.ObjectId(movieId),
          user: mongoose.Types.ObjectId(req.userId),
        },
      },
    ]);

    likeOrDislike.map((likeItem) => (userLikeOrDislike = likeItem.like));

    movieLikesDislikes = movie._doc;
    movieLikesDislikes.numberOfLikes = likes;
    movieLikesDislikes.numberOfDislikes = dislikes;
    movieLikesDislikes.likedOrDislikedUser = userLikeOrDislike;

    res.status(200).json(movieLikesDislikes);
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
    const movie = await Movie.findById(movieId);

    const movies = await Movie.find({ genre: movie.genre }).limit(10);

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
    const likesMovie = await Like.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieObject",
        },
      },
      {
        $match: {
          like: 1,
        },
      },
      {
        $group: {
          _id: "$movie",
          movie: { $first: "$movieObject" },
          numberLikes: { $sum: 1 },
        },
      },
      { $sort: { numberLikes: -1 } },
      { $project: { "movie.title": 1 } },
    ]);

    res.status(200).json(likesMovie);
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
    const movie = await Movie.findById(movieId);
    movie.visits = movie.visits + 1;
    await movie.save();
    res.status(200).json(movie);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
