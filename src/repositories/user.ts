import User, { IUser, BaseUser, IUserMovieWatchlist } from "../models/user";
import mongoose from "mongoose";

const createUser = async (
  userData: BaseUser,
  hashedPw: string
): Promise<IUser> => {
  const user: IUser = new User({
    email: userData.email,
    password: hashedPw,
    name: userData.name,
  });
  return await user.save();
};

const findUserWithEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email: email });
};

const getUser = async (userId: string): Promise<IUserMovieWatchlist> => {
  const userArray: IUserMovieWatchlist[] = await User.aggregate([
    {
      $lookup: {
        from: "watchlists",
        localField: "watchlists",
        foreignField: "_id",
        as: "watchlistsArray",
      },
    },
    {
      $lookup: {
        from: "movies",
        localField: "watchlistsArray.movie",
        foreignField: "_id",
        as: "moviesArray",
      },
    },

    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);
  const user: IUserMovieWatchlist = userArray[0];

  return user;
};

const findUserAndUpdateLikes = async (
  userId: string,
  likeId: string
): Promise<IUser | null> => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $push: { likes: likeId } },
    { new: true }
  );
};

const findUserAndUpdateWatchlistsAdd = async (
  userId: string,
  watchlistId: string
): Promise<IUser | null> => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $push: { watchlists: watchlistId } },
    { new: true }
  );
};

const findUserAndUpdateWatchlistsDelete = async (
  userId: string,
  watchlistId: string
): Promise<IUser | null> => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { watchlists: watchlistId } },
    { new: true }
  );
};

export default {
  createUser,
  findUserWithEmail,
  getUser,
  findUserAndUpdateLikes,
  findUserAndUpdateWatchlistsAdd,
  findUserAndUpdateWatchlistsDelete,
};
