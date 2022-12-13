import Like, { ILike, BaseLike } from "../models/like";
import Movie, { IMovie } from "../models/movie";
import User, { IUser } from "../models/user";

const createLike = async (dataLike: BaseLike): Promise<ILike> => {
  const newLike: ILike = new Like({
    like: dataLike.like,
    movie: dataLike.movie,
    user: dataLike.user,
  });
  const like: ILike = await newLike.save();

  const movie: IMovie | null = await Movie.findById(dataLike.movie);

  if (!movie) {
    const error: any = new Error("Could not find movie.");
    error.statusCode = 400;
    throw error;
  }
  movie.likes.push(like._id);
  await movie.save();

  const user: IUser | null = await User.findById(dataLike.user);
  if (!user) {
    const error: any = new Error("Could not find user.");
    error.statusCode = 400;
    throw error;
  }
  user.likes.push(like._id);
  await user.save();

  return like;
};

const deleteLike = async (movieId: string, userId: string): Promise<number> => {
  const like: ILike | null = await Like.findOne({
    user: userId,
    movie: movieId,
  });
  if (!like) {
    const error: any = new Error("Could not find like.");
    error.statusCode = 404;
    throw error;
  }

  const deletedLike = await Like.deleteOne({ _id: like._id });

  const user: IUser | null = await User.findById(userId);
  if (!user) {
    const error: any = new Error("Could not find user.");
    error.statusCode = 400;
    throw error;
  }

  user.likes = user.likes.filter(
    (likeItem: any) => likeItem.toString() != like._id.toString()
  );
  await user.save();

  const movie: IMovie | null = await Movie.findById(movieId);
  if (!movie) {
    const error: any = new Error("Could not find movie.");
    error.statusCode = 400;
    throw error;
  }
  movie.likes = movie.likes.filter(
    (likeItem: any) => likeItem.toString() != like._id.toString()
  );
  await movie.save();

  return deletedLike.deletedCount;
};

export default {
  createLike,
  deleteLike,
};
