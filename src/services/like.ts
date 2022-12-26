import { ILike, BaseLike } from "../models/like";
import { IMovie } from "../models/movie";
import { IUser } from "../models/user";
import { NotFoundError } from "../utils/app-error";
import likeRepo from "../repositories/like";
import movieRepo from "../repositories/movie";
import userRepo from "../repositories/user";

const createLike = async (dataLike: BaseLike): Promise<ILike> => {
  const like: ILike = await likeRepo.createLike(dataLike);

  const movie: IMovie | null = await movieRepo.findMovieAndUpdateLikes(
    dataLike.movie,
    like._id
  );

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }

  const user: IUser | null = await userRepo.findUserAndUpdateLikes(
    dataLike.user,
    like._id
  );

  if (!user) {
    const error: NotFoundError = new NotFoundError("Could not find user.");
    throw error;
  }

  return like;
};

const deleteLike = async (movieId: string, userId: string): Promise<number> => {
  const like: ILike | null = await likeRepo.findLike(movieId, userId);

  if (!like) {
    const error: NotFoundError = new NotFoundError("Could not find like.");
    throw error;
  }

  const deletedLike = await likeRepo.deleteLike(like._id);

  const user: IUser | null = await userRepo.findUserAndUpdateLikes(
    userId,
    like._id
  );

  if (!user) {
    const error: NotFoundError = new NotFoundError("Could not find user.");
    throw error;
  }

  const movie: IMovie | null = await movieRepo.findMovieAndUpdateLikes(
    movieId,
    like._id
  );

  if (!movie) {
    const error: NotFoundError = new NotFoundError("Could not find movie.");
    throw error;
  }

  return deletedLike.deletedCount;
};

export default {
  createLike,
  deleteLike,
};
