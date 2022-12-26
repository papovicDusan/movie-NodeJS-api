import Movie, {
  IMovie,
  BaseMovie,
  IMovieLikesDislikes,
  IMovieLikesDislikesUser,
  IMoviePaginate,
  IMoviePopular,
} from "../models/movie";
import Like, { ILike } from "../models/like";
import mongoose from "mongoose";

const createMovie = async (dataMovie: BaseMovie): Promise<IMovie> => {
  const movie: IMovie = new Movie({
    title: dataMovie.title,
    description: dataMovie.description,
    image_url: dataMovie.image_url,
    genre: dataMovie.genre,
  });
  return await movie.save();
};

const findMovie = async (movieId: string): Promise<IMovie | null> => {
  return await Movie.findById(movieId);
};

const getMovie = async (
  movie: any,
  movieId: string,
  userId: string
): Promise<IMovieLikesDislikesUser> => {
  let likes: number = 0;
  let dislikes: number = 0;
  let userLikeOrDislike: number = 0;

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

const getMovies = async (
  page: number,
  limit: number,
  query: any
): Promise<IMoviePaginate> => {
  const movies: any = await Movie.paginate(query, { page: page, limit: limit });

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

const getMoviesGenre = async (genre: string): Promise<IMovie[]> => {
  return await Movie.find({ genre: genre }).limit(10);
};

const getMoviesPopular = async (): Promise<IMoviePopular[]> => {
  return await Like.aggregate([
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
};

const updateMovieVisits = async (movie: IMovie): Promise<IMovie> => {
  movie.visits = movie.visits + 1;
  return await movie.save();
};

const findMovieAndUpdateComments = async (
  movieId: string,
  commentId: string
): Promise<IMovie | null> => {
  return await Movie.findOneAndUpdate(
    { _id: movieId },
    { $push: { comments: commentId } },
    { new: true }
  );
};

const findMovieAndUpdateLikes = async (
  movieId: string,
  likeId: string
): Promise<IMovie | null> => {
  return await Movie.findOneAndUpdate(
    { _id: movieId },
    { $push: { likes: likeId } },
    { new: true }
  );
};

const findMovieAndUpdateWatchlistsAdd = async (
  movieId: string,
  watchlistId: string
): Promise<IMovie | null> => {
  return await Movie.findOneAndUpdate(
    { _id: movieId },
    { $push: { watchlists: watchlistId } },
    { new: true }
  );
};

const findMovieAndUpdateWatchlistsDelete = async (
  movieId: string,
  watchlistId: string
): Promise<IMovie | null> => {
  return await Movie.findOneAndUpdate(
    { _id: movieId },
    { $push: { watchlists: watchlistId } },
    { new: true }
  );
};

export default {
  createMovie,
  findMovie,
  getMovie,
  getMovies,
  getMoviesGenre,
  getMoviesPopular,
  updateMovieVisits,
  findMovieAndUpdateComments,
  findMovieAndUpdateLikes,
  findMovieAndUpdateWatchlistsAdd,
  findMovieAndUpdateWatchlistsDelete,
};
