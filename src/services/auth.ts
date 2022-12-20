import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser, BaseUser, IUserMovieWatchlist } from "../models/user";
import mongoose from "mongoose";
import config from "../../config";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { validateUserData, validateLoginData } from "../utils/validations";

const signup = async (userData: BaseUser): Promise<IUser> => {
  const valid = validateUserData(userData);
  if (valid.error) {
    const error: AppError = new AppError(
      valid.error.message,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const userExists: IUser | null = await User.findOne({
    email: userData.email,
  });
  if (userExists) {
    const error: AppError = new AppError(
      `A user with email ${userData.email} exist.`,
      StatusCodes.BAD_REQUEST
    );
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
  const valid = validateLoginData({ email, password });
  if (valid.error) {
    const error: AppError = new AppError(
      valid.error.message,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const user: IUser | null = await User.findOne({ email: email });
  if (!user) {
    const error: AppError = new AppError(
      `A user with email ${email} could not be found.`,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error: AppError = new AppError(
      "Wrong password!",
      StatusCodes.BAD_REQUEST
    );
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

  if (!user) {
    const error: AppError = new AppError(
      "Could not find user.",
      StatusCodes.NOT_FOUND
    );
    throw error;
  }

  return user;
};

export default { signup, login, getUser };
