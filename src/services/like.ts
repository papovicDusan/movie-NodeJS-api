import Like, { ILike, BaseLike } from "../models/like";
import Movie, { IMovie } from "../models/movie";
import User, { IUser } from "../models/user";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

const createLike = async (dataLike: BaseLike): Promise<ILike> => {
  const newLike: ILike = new Like({
    like: dataLike.like,
    movie: dataLike.movie,
    user: dataLike.user,
  });
  const like: ILike = await newLike.save();

  const movie: IMovie | null = await Movie.findOneAndUpdate(
    { _id: dataLike.movie },
    { $push: { likes: like._id } },
    { new: true }
  );

  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const user: IUser | null = await User.findOneAndUpdate(
    { _id: dataLike.user },
    { $push: { likes: like._id } },
    { new: true }
  );

  if (!user) {
    const error: AppError = new AppError(
      "Could not find user.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  return like;
};

const deleteLike = async (movieId: string, userId: string): Promise<number> => {
  const like: ILike | null = await Like.findOne({
    user: userId,
    movie: movieId,
  });
  if (!like) {
    const error: AppError = new AppError(
      "Could not find like.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const deletedLike = await Like.deleteOne({ _id: like._id });

  const user: IUser | null = await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { likes: like._id } },
    { new: true }
  );

  if (!user) {
    const error: AppError = new AppError(
      "Could not find user.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  const movie: IMovie | null = await Movie.findOneAndUpdate(
    { _id: movieId },
    { $pull: { likes: like._id } },
    { new: true }
  );

  if (!movie) {
    const error: AppError = new AppError(
      "Could not find movie.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  return deletedLike.deletedCount;
};

export default {
  createLike,
  deleteLike,
};
