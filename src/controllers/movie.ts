import movieService from "../services/movie";
import { NextFunction, Request, Response } from "express";
import {
  IMovie,
  BaseMovie,
  IMovieLikesDislikes,
  IMovieLikesDislikesUser,
  IMoviePaginate,
  IMoviePopular,
} from "../models/movie";
import { ParsedQs } from "qs";
import { StatusCodes } from "http-status-codes";

const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  const page: number = Number(req.query.page) || 1;
  const limit: number = 2;

  const search: string | ParsedQs | string[] | ParsedQs[] =
    req.query.search || "";
  const genre: string | ParsedQs | string[] | ParsedQs[] =
    req.query.genre || "";

  const movies: IMoviePaginate = await movieService.getMovies(
    page,
    limit,
    search,
    genre
  );

  res.status(StatusCodes.OK).json(movies);
};

const createMovie = async (req: Request, res: Response, next: NextFunction) => {
  const movieData: BaseMovie = {
    title: req.body.title,
    description: req.body.description,
    image_url: req.body.image_url,
    genre: req.body.genre,
  };

  const movie: IMovie = await movieService.createMovie(movieData);

  res.status(StatusCodes.CREATED).json(movie);
};

const getMovie = async (req: Request, res: Response, next: NextFunction) => {
  const movieId: string = req.params.movieId;
  const userId: string = req.body.userId;

  const movie: IMovieLikesDislikesUser = await movieService.getMovie(
    movieId,
    userId
  );

  res.status(StatusCodes.OK).json(movie);
};

const getMoviesGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movieId: string = req.params.movieId;

  const movies: IMovie[] = await movieService.getMoviesGenre(movieId);

  res.status(StatusCodes.OK).json(movies);
};

const getMoviesPopular = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movies: IMoviePopular[] = await movieService.getMoviesPopular();

  res.status(StatusCodes.OK).json(movies);
};

const setMovieVisits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movieId: string = req.params.movieId;

  const movie: IMovie = await movieService.setMovieVisits(movieId);

  res.status(StatusCodes.OK).json(movie);
};

export default {
  getMovies,
  createMovie,
  getMovie,
  getMoviesGenre,
  getMoviesPopular,
  setMovieVisits,
};
