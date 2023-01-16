import {
  IMovie,
  BaseMovie,
  IMovieLikesDislikesUser,
  IMoviePaginate,
  IMoviePopular,
} from "../models/movie";
import { ParsedQs } from "qs";
import { NotFoundError } from "../utils/app-error";
import movieRepo from "../repositories/movie";

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

  const movies: any = await movieRepo.getMovies(page, limit, query);

  return movies;
};

const createMovie = async (dataMovie: BaseMovie): Promise<IMovie> => {
  const movie: IMovie = await movieRepo.createMovie(dataMovie);

  return movie;
};

const getMovie = async (
  movieId: string,
  userId: string
): Promise<IMovieLikesDislikesUser> => {
  const movie: IMovie | null = await movieRepo.findMovie(movieId);

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }
  const movieLikesDislikes: IMovieLikesDislikesUser = await movieRepo.getMovie(
    movie,
    movieId,
    userId
  );
  return movieLikesDislikes;
};

const getMoviesGenre = async (movieId: string): Promise<IMovie[]> => {
  const movie: IMovie | null = await movieRepo.findMovie(movieId);

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }
  const movies = await movieRepo.getMoviesGenre(movie.genre);
  return movies;
};

const getMoviesPopular = async (): Promise<IMoviePopular[]> => {
  const moviesPopular: IMoviePopular[] = await movieRepo.getMoviesPopular();
  return moviesPopular;
};

const setMovieVisits = async (movieId: string): Promise<IMovie> => {
  const movie: IMovie | null = await movieRepo.findMovie(movieId);

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }

  const updateMovie: IMovie = await movieRepo.updateMovieVisits(movie);

  return updateMovie;
};

export default {
  getMovies,
  createMovie,
  getMovie,
  getMoviesGenre,
  getMoviesPopular,
  setMovieVisits,
};
