import Like, { ILike } from "../models/like";
import Movie, {
  IMovie,
  BaseMovie,
  IMovieLikesDislikes,
  IMovieLikesDislikesUser,
  IMoviePaginate,
  IMoviePopular,
} from "../models/movie";
import mongoose from "mongoose";
import { ParsedQs } from "qs";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { validateMovieData } from "../utils/validations";

const getMovies = async (
  page: number,
  limit: number,
  search: string | ParsedQs | string[] | ParsedQs[],
  genre: string | ParsedQs | string[] | ParsedQs[]
): Promise<IMoviePaginate> => {
  const query: any = {};

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  if (genre) {
    query.genre = genre;
  }

  const movies: any = await Movie.paginate({}, { page: page, limit: limit });

  const moviesLikesDislikes: IMovieLikesDislikes[] = await Promise.all(
    movies.docs.map(async (movie: any) => {
      let likes: number = 0;
      let dislikes: number = 0;
      let movieLikesDislikes: IMovieLikesDislikes = {
        ...movie,
        numberOfLikes: 0,
        numberOfDislikes: 0,
      };

      const likesDislikesNumber: {
        _id: number;
        numberLikesOrDislikes: number;
      }[] = await Like.aggregate([
        {
          $match: {
            movie: new mongoose.Types.ObjectId(movie._id),
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

  movies.docs = moviesLikesDislikes;

  return movies;
};

const createMovie = async (dataMovie: BaseMovie): Promise<IMovie> => {
  const valid = validateMovieData(dataMovie);
  if (valid.error) {
    const error: AppError = new AppError(
      valid.error.message,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const movieNew: IMovie = new Movie({
    title: dataMovie.title,
    description: dataMovie.description,
    image_url: dataMovie.image_url,
    genre: dataMovie.genre,
  });
  const movie: IMovie = await movieNew.save();

  return movie;
};

const getMovie = async (
  movieId: string,
  userId: string
): Promise<IMovieLikesDislikesUser> => {
  let likes: number = 0;
  let dislikes: number = 0;
  let userLikeOrDislike: number = 0;

  const movie: any = await Movie.findById(movieId);

  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  let movieLikesDislikes: IMovieLikesDislikesUser = {
    ...movie._doc,
    numberOfLikes: 0,
    numberOfDislikes: 0,
    likedOrDislikedUser: 0,
  };
  const likesDislikesNumber: {
    _id: number;
    numberLikesOrDislikes: number;
  }[] = await Like.aggregate([
    {
      $match: {
        movie: new mongoose.Types.ObjectId(movie._id),
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

  const likeOrDislike: ILike[] = await Like.aggregate([
    {
      $match: {
        movie: new mongoose.Types.ObjectId(movieId),
        user: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  likeOrDislike.map((likeItem: ILike) => (userLikeOrDislike = likeItem.like));

  movieLikesDislikes.numberOfLikes = likes;
  movieLikesDislikes.numberOfDislikes = dislikes;
  movieLikesDislikes.likedOrDislikedUser = userLikeOrDislike;

  return movieLikesDislikes;
};

const getMoviesGenre = async (movieId: string): Promise<IMovie[]> => {
  const movie: IMovie | null = await Movie.findById(movieId);
  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }
  const movies = await Movie.find({
    genre: movie.genre,
  }).limit(10);
  return movies;
};

const getMoviesPopular = async (): Promise<IMoviePopular[]> => {
  const likesMovie: IMoviePopular[] = await Like.aggregate([
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

const setMovieVisits = async (movieId: string): Promise<IMovie> => {
  const movie: IMovie | null = await Movie.findById(movieId);
  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }
  movie.visits = movie.visits + 1;
  await movie.save();

  return movie;
};

export default {
  getMovies,
  createMovie,
  getMovie,
  getMoviesGenre,
  getMoviesPopular,
  setMovieVisits,
};
