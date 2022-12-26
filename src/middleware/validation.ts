import { NextFunction, Request, Response } from "express";
import {
  validateUserData,
  validateLoginData,
  validateCommentData,
  validateMovieData,
} from "../utils/validations";
import { BadRequestError } from "../utils/app-error";
import { BaseUser } from "../models/user";
import { BaseComment } from "../models/comment";
import { BaseMovie } from "../models/movie";

export const validationLoginData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;

  const valid = validateLoginData({ email, password });
  if (valid.error) {
    const error: BadRequestError = new BadRequestError(valid.error.message);
    throw error;
  }

  next();
};

export const validationUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData: BaseUser = req.body;

  const valid = validateUserData(userData);
  if (valid.error) {
    const error: BadRequestError = new BadRequestError(valid.error.message);
    throw error;
  }

  next();
};

export const validationCommentData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentData: BaseComment = {
    content: req.body.content,
    movie: req.body.movie_id,
  };

  const valid = validateCommentData(commentData);
  if (valid.error) {
    const error: BadRequestError = new BadRequestError(valid.error.message);
    throw error;
  }

  next();
};

export const validationMovieData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movieData: BaseMovie = {
    title: req.body.title,
    description: req.body.description,
    image_url: req.body.image_url,
    genre: req.body.genre,
  };

  const valid = validateMovieData(movieData);
  if (valid.error) {
    const error: BadRequestError = new BadRequestError(valid.error.message);
    throw error;
  }

  next();
};
