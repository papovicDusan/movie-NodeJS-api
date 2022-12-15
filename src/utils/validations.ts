import Joi from "joi";
import { BaseUser } from "../models/user";
import { BaseComment } from "../models/comment";
import { BaseMovie } from "../models/movie";

export const validateLoginData = (login: {
  email: string;
  password: string;
}) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return loginSchema.validate(login, { abortEarly: false });
};

export const validateUserData = (user: BaseUser) => {
  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  });

  return userSchema.validate(user, { abortEarly: false });
};

export const validateCommentData = (comment: BaseComment) => {
  const commentSchema = Joi.object({
    content: Joi.string().required(),
    movie: Joi.string().required(),
  });

  return commentSchema.validate(comment, { abortEarly: false });
};

export const validateMovieData = (movie: BaseMovie) => {
  const movieSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image_url: Joi.string().required(),
    genre: Joi.string().required(),
  });

  return movieSchema.validate(movie, { abortEarly: false });
};
