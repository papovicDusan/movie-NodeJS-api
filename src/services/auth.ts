import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, BaseUser, IUserMovieWatchlist } from "../models/user";
import config from "../../config";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { validateUserData, validateLoginData } from "../utils/validations";
import userRepo from "../repositories/user";

const signup = async (userData: BaseUser): Promise<IUser> => {
  const valid = validateUserData(userData);
  if (valid.error) {
    const error: AppError = new AppError(
      valid.error.message,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const userExists: IUser | null = await userRepo.findUserWithEmail(
    userData.email
  );

  if (userExists) {
    const error: AppError = new AppError(
      `A user with email ${userData.email} exist.`,
      StatusCodes.BAD_REQUEST
    );
    throw error;
  }

  const hashedPw = await bcrypt.hash(userData.password, 12);

  const user: IUser = await userRepo.createUser(userData, hashedPw);
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

  const user: IUser | null = await userRepo.findUserWithEmail(email);

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
  const user: IUserMovieWatchlist = await userRepo.getUser(userId);

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
