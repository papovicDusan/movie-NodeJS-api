import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser, BaseUser, IUserMovieWatchlist } from "../models/user";
import mongoose from "mongoose";
import config from "../../config";

const signup = async (userData: BaseUser): Promise<IUser> => {
  const userExists: IUser | null = await User.findOne({
    email: userData.email,
  });
  if (userExists) {
    const error: any = new Error("A user with this email exist.");
    error.statusCode = 400;
    throw error;
  }

  const hashedPw = await bcrypt.hash(userData.password, 12);

  const userNew: IUser = new User({
    email: userData.email,
    password: hashedPw,
    name: userData.name,
  });
  const user: IUser = await userNew.save();

  return user;
};

const login = async (
  email: string,
  password: string
): Promise<{ access: string; userId: string }> => {
  const user: IUser | null = await User.findOne({ email: email });
  if (!user) {
    const error: any = new Error("A user with this email could not be found.");
    error.statusCode = 400;
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error: any = new Error("Wrong password!");
    error.statusCode = 400;
    throw error;
  }

  const token: string = jwt.sign(
    {
      userId: user._id.toString(),
    },
    config.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  return { access: token, userId: user._id.toString() };
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

export default { signup, login, getUser };
