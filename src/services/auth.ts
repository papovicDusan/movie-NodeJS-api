import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, BaseUser, IUserMovieWatchlist } from "../models/user";
import config from "../../config";
import { NotFoundError, BadRequestError } from "../utils/app-error";
import { validateUserData, validateLoginData } from "../utils/validations";
import userRepo from "../repositories/user";

const signup = async (userData: BaseUser): Promise<IUser> => {
  const userExists: IUser | null = await userRepo.findUserWithEmail(
    userData.email
  );

  if (userExists) {
    const error: BadRequestError = new BadRequestError(
      `A user with email ${userData.email} exist.`
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
  const user: IUser | null = await userRepo.findUserWithEmail(email);

  if (!user) {
    const error: NotFoundError = new NotFoundError(
      `A user with email ${email} could not be found.`
    );
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error: BadRequestError = new BadRequestError("Wrong password!");
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
    const error: NotFoundError = new NotFoundError("Could not find user.");
    throw error;
  }

  return user;
};

export default { signup, login, getUser };
