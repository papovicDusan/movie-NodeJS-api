const Movie = require("../models/movie");
const Like = require("../models/like");
const mongoose = require("mongoose");

exports.getMovies = async (page, limit, search, genre) => {
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

      const likesDislikesNumber = await Like.aggregate([
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

      likesDislikesNumber.map((likeItem) => {
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

  return {
    count: results.count,
    next: results.next,
    previous: results.previous,
    results: moviesLikesDislikes,
  };
};

exports.createMovie = async (title, description, imageUrl, genre) => {
  const movieNew = new Movie({
    title: title,
    description: description,
    image_url: imageUrl,
    genre: genre,
  });
  const movie = await movieNew.save();

  return movie;
};

exports.getMovie = async (movieId, userId) => {
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

  const likesDislikesNumber = await Like.aggregate([
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

  likesDislikesNumber.map((likeItem) => {
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
        user: mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  likeOrDislike.map((likeItem) => (userLikeOrDislike = likeItem.like));

  movieLikesDislikes = movie._doc;
  movieLikesDislikes.numberOfLikes = likes;
  movieLikesDislikes.numberOfDislikes = dislikes;
  movieLikesDislikes.likedOrDislikedUser = userLikeOrDislike;

  return movieLikesDislikes;
};

exports.getMoviesGenre = async (movieId) => {
  const movie = await Movie.findById(movieId);

  const movies = await Movie.find({ genre: movie.genre }).limit(10);

  return movies;
};

exports.getMoviesPopular = async () => {
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
    { $limit: 10 },
  ]);

  return likesMovie;
};

exports.setMovieVisits = async (movieId) => {
  const movie = await Movie.findById(movieId);
  movie.visits = movie.visits + 1;
  await movie.save();

  return movie;
};
