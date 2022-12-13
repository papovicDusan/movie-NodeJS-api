import movieService from "../services/movie";
import { NextFunction, Request, Response } from "express";
import log from "../logger";
import Movie, {
  IMovie,
  BaseMovie,
  IMovieLikesDislikes,
  IMovieLikesDislikesUser,
  IMoviePaginate,
  IMoviePopular,
} from "../models/movie";
import { ParsedQs } from "qs";

const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    res.status(200).json(movies);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const createMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movieData: BaseMovie = {
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url,
      genre: req.body.genre,
    };

    const movie: IMovie = await movieService.createMovie(movieData);

    res.status(201).json(movie);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movieId: string = req.params.movieId;
    const userId: string = req.body.userId;

    const movie: IMovieLikesDislikesUser = await movieService.getMovie(
      movieId,
      userId
    );

    res.status(200).json(movie);
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getMoviesGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId: string = req.params.movieId;

    const movies: IMovie[] = await movieService.getMoviesGenre(movieId);

    res.status(200).json(movies);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getMoviesPopular = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movies: IMoviePopular[] = await movieService.getMoviesPopular();

    res.status(200).json(movies);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const setMovieVisits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const movieId: string = req.params.movieId;

    const movie: IMovie = await movieService.setMovieVisits(movieId);

    res.status(200).json(movie);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export default {
  getMovies,
  createMovie,
  getMovie,
  getMoviesGenre,
  getMoviesPopular,
  setMovieVisits,
};
